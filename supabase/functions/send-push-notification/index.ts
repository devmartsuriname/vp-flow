import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authorization: Only accept internal trigger calls
    const authHeader = req.headers.get('Authorization');
    const triggerSource = req.headers.get('x-trigger-source');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Validate JWT
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(
      authHeader.replace('Bearer ', '')
    );
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Security: Only allow internal trigger calls (anon role + pg_trigger header)
    // or service_role calls. Block direct client invocations.
    const callerRole = (claimsData.claims as Record<string, unknown>).role;
    const isInternalTrigger = callerRole === 'anon' && triggerSource === 'pg_trigger';
    const isServiceRole = callerRole === 'service_role';
    
    if (!isInternalTrigger && !isServiceRole) {
      return new Response(JSON.stringify({ error: 'Forbidden: internal use only' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    const { userId, title, message, link } = await req.json();
    if (!userId || !title) {
      return new Response(JSON.stringify({ error: 'userId and title are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch VAPID keys
    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY');
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');
    const vapidSubject = Deno.env.get('VAPID_SUBJECT');
    if (!vapidPublicKey || !vapidPrivateKey || !vapidSubject) {
      return new Response(JSON.stringify({ error: 'VAPID keys not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use service role to query push subscriptions (cross-user)
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: subscriptions, error: subError } = await adminClient
      .from('push_subscriptions')
      .select('endpoint, p256dh, auth_key')
      .eq('user_id', userId);

    if (subError) {
      console.error('Error fetching subscriptions:', subError);
      return new Response(JSON.stringify({ error: 'Failed to fetch subscriptions' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: 'No push subscriptions found' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Send Web Push to each subscription
    const payload = JSON.stringify({ title, body: message, link, tag: `vp-flow-${Date.now()}` });
    let sent = 0;
    let failed = 0;

    for (const sub of subscriptions) {
      try {
        const pushResult = await sendWebPush(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth_key } },
          payload,
          vapidPublicKey,
          vapidPrivateKey,
          vapidSubject
        );
        if (pushResult.ok) {
          sent++;
        } else {
          failed++;
          // Remove expired/invalid subscriptions (410 Gone)
          if (pushResult.status === 410 || pushResult.status === 404) {
            await adminClient
              .from('push_subscriptions')
              .delete()
              .eq('endpoint', sub.endpoint)
              .eq('user_id', userId);
          }
        }
      } catch (e) {
        console.error('Push send error:', e);
        failed++;
      }
    }

    return new Response(JSON.stringify({ sent, failed }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Web Push implementation using raw Web Push protocol (RFC 8291)
async function sendWebPush(
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  payload: string,
  vapidPublicKey: string,
  vapidPrivateKey: string,
  vapidSubject: string
): Promise<Response> {
  const url = new URL(subscription.endpoint);
  const audience = `${url.protocol}//${url.host}`;

  // Create VAPID JWT
  const vapidToken = await createVapidJwt(audience, vapidSubject, vapidPrivateKey);

  // Encrypt payload using Web Push encryption (RFC 8291 / aes128gcm)
  const encrypted = await encryptPayload(
    subscription.keys.p256dh,
    subscription.keys.auth,
    new TextEncoder().encode(payload)
  );

  const response = await fetch(subscription.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'aes128gcm',
      'TTL': '86400',
      'Authorization': `vapid t=${vapidToken}, k=${vapidPublicKey}`,
    },
    body: encrypted,
  });

  return response;
}

async function createVapidJwt(audience: string, subject: string, privateKeyBase64url: string): Promise<string> {
  const header = { typ: 'JWT', alg: 'ES256' };
  const now = Math.floor(Date.now() / 1000);
  const payload = { aud: audience, exp: now + 86400, sub: subject };

  const headerB64 = base64urlEncode(new TextEncoder().encode(JSON.stringify(header)));
  const payloadB64 = base64urlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const unsignedToken = `${headerB64}.${payloadB64}`;

  // Import private key
  const privateKeyBytes = base64urlDecode(privateKeyBase64url);
  const key = await crypto.subtle.importKey(
    'jwk',
    {
      kty: 'EC',
      crv: 'P-256',
      d: privateKeyBase64url,
      x: '', // Will be derived
      y: '',
    },
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  ).catch(async () => {
    // Fallback: import as raw PKCS8
    const pkcs8 = createPkcs8FromRaw(privateKeyBytes);
    return crypto.subtle.importKey(
      'pkcs8',
      pkcs8,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['sign']
    );
  });

  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    key,
    new TextEncoder().encode(unsignedToken)
  );

  // Convert DER signature to raw r||s format
  const sigBytes = new Uint8Array(signature);
  let rawSig: Uint8Array;
  if (sigBytes.length === 64) {
    rawSig = sigBytes;
  } else {
    rawSig = derToRaw(sigBytes);
  }

  return `${unsignedToken}.${base64urlEncode(rawSig)}`;
}

function createPkcs8FromRaw(rawKey: Uint8Array): Uint8Array {
  // PKCS8 wrapper for EC P-256 private key
  const prefix = new Uint8Array([
    0x30, 0x41, 0x02, 0x01, 0x00, 0x30, 0x13, 0x06, 0x07, 0x2a, 0x86, 0x48,
    0xce, 0x3d, 0x02, 0x01, 0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03,
    0x01, 0x07, 0x04, 0x27, 0x30, 0x25, 0x02, 0x01, 0x01, 0x04, 0x20,
  ]);
  const result = new Uint8Array(prefix.length + rawKey.length);
  result.set(prefix);
  result.set(rawKey, prefix.length);
  return result;
}

function derToRaw(der: Uint8Array): Uint8Array {
  // Parse DER ECDSA signature to raw r||s (each 32 bytes)
  const raw = new Uint8Array(64);
  let offset = 2; // skip SEQUENCE tag + length
  
  // R value
  const rLen = der[offset + 1];
  offset += 2;
  const rStart = rLen > 32 ? offset + (rLen - 32) : offset;
  const rDest = rLen < 32 ? 32 - rLen : 0;
  raw.set(der.slice(rStart, offset + rLen), rDest);
  offset += rLen;
  
  // S value
  const sLen = der[offset + 1];
  offset += 2;
  const sStart = sLen > 32 ? offset + (sLen - 32) : offset;
  const sDest = sLen < 32 ? 64 - sLen : 32;
  raw.set(der.slice(sStart, offset + sLen), sDest);
  
  return raw;
}

async function encryptPayload(
  p256dhBase64url: string,
  authBase64url: string,
  plaintext: Uint8Array
): Promise<Uint8Array> {
  // Import subscriber's public key
  const subscriberPublicKeyBytes = base64urlDecode(p256dhBase64url);
  const authSecret = base64urlDecode(authBase64url);

  // Generate ephemeral ECDH key pair
  const localKeyPair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveBits']
  ) as CryptoKeyPair;

  const subscriberPublicKey = await crypto.subtle.importKey(
    'raw',
    subscriberPublicKeyBytes,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    []
  );

  // ECDH shared secret
  const sharedSecret = new Uint8Array(
    await crypto.subtle.deriveBits(
      { name: 'ECDH', public: subscriberPublicKey },
      localKeyPair.privateKey,
      256
    )
  );

  const localPublicKeyBytes = new Uint8Array(
    await crypto.subtle.exportKey('raw', localKeyPair.publicKey)
  );

  // Key derivation (RFC 8291)
  const ikm = await hkdf(authSecret, sharedSecret, buildInfo('WebPush: info\0', subscriberPublicKeyBytes, localPublicKeyBytes), 32);
  
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const prk = await hkdf(salt, ikm, new TextEncoder().encode('Content-Encoding: aes128gcm\0'), 16);
  const nonce = await hkdf(salt, ikm, new TextEncoder().encode('Content-Encoding: nonce\0'), 12);

  // Encrypt with AES-128-GCM
  const key = await crypto.subtle.importKey('raw', prk, 'AES-GCM', false, ['encrypt']);
  
  // Add padding (2 bytes for padding length + delimiter)
  const paddedPlaintext = new Uint8Array(plaintext.length + 2);
  paddedPlaintext.set(plaintext);
  paddedPlaintext[plaintext.length] = 2; // delimiter
  paddedPlaintext[plaintext.length + 1] = 0; // padding

  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, key, paddedPlaintext)
  );

  // Build aes128gcm header: salt (16) + rs (4) + idlen (1) + keyid (65) + ciphertext
  const rs = paddedPlaintext.length + 16; // record size = plaintext + tag
  const header = new Uint8Array(16 + 4 + 1 + localPublicKeyBytes.length);
  header.set(salt, 0);
  new DataView(header.buffer).setUint32(16, rs);
  header[20] = localPublicKeyBytes.length;
  header.set(localPublicKeyBytes, 21);

  const result = new Uint8Array(header.length + ciphertext.length);
  result.set(header);
  result.set(ciphertext, header.length);

  return result;
}

function buildInfo(type: string, subscriberKey: Uint8Array, localKey: Uint8Array): Uint8Array {
  const typeBytes = new TextEncoder().encode(type);
  const result = new Uint8Array(typeBytes.length + subscriberKey.length + localKey.length);
  result.set(typeBytes);
  result.set(subscriberKey, typeBytes.length);
  result.set(localKey, typeBytes.length + subscriberKey.length);
  return result;
}

async function hkdf(salt: Uint8Array, ikm: Uint8Array, info: Uint8Array, length: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey('raw', ikm, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const prk = new Uint8Array(await crypto.subtle.sign('HMAC', await crypto.subtle.importKey('raw', salt, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']), ikm));
  
  const prkKey = await crypto.subtle.importKey('raw', prk, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const infoWithCounter = new Uint8Array(info.length + 1);
  infoWithCounter.set(info);
  infoWithCounter[info.length] = 1;
  
  const output = new Uint8Array(await crypto.subtle.sign('HMAC', prkKey, infoWithCounter));
  return output.slice(0, length);
}

function base64urlEncode(bytes: Uint8Array): string {
  const binary = Array.from(bytes).map(b => String.fromCharCode(b)).join('');
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, c => c.charCodeAt(0));
}
