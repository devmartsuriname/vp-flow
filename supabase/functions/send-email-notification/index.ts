import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import nodemailer from "npm:nodemailer";

// TC-006 Phase 1A.2 — Email Notifications
// Server-side only: invoked by pg_net from trigger_email_notification AND
// by the Settings UI Test Connection button (via supabase.functions.invoke).
// No browser-direct calls. CORS headers omitted intentionally (mirrors push fn).
const jsonHeaders = { "Content-Type": "application/json" };

type EmailSettingsRow = {
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  from_address: string;
  from_name: string;
  enabled: boolean;
};

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: jsonHeaders,
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    const triggerSource = req.headers.get("x-trigger-source");

    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: jsonHeaders,
      });
    }

    // Manual JWT payload decode — identical pattern to send-push-notification.
    // Auth Gateway verifies signature; we only inspect the role claim.
    const jwt = authHeader.replace("Bearer ", "");
    let callerRole: string;
    try {
      const payloadBase64 = jwt.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64)) as Record<string, unknown>;
      callerRole = payload.role as string;
      if (!callerRole) throw new Error("no role claim");
    } catch {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: jsonHeaders,
      });
    }

    if (callerRole !== "service_role") {
      return new Response(JSON.stringify({ error: "Forbidden: service role required" }), {
        status: 403,
        headers: jsonHeaders,
      });
    }

    const body = await req.json().catch(() => ({}));
    const isTest = body?.test === true;

    // Normal (trigger) mode requires x-trigger-source header. Test mode does not
    // (called by Settings UI via supabase.functions.invoke), but still requires
    // service_role JWT above.
    if (!isTest && triggerSource !== "pg_trigger") {
      return new Response(JSON.stringify({ error: "Forbidden: internal use only" }), {
        status: 403,
        headers: jsonHeaders,
      });
    }

    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Load SMTP settings (single-row config)
    const { data: settings, error: settingsError } = await adminClient
      .from("email_settings")
      .select("smtp_host, smtp_port, smtp_username, smtp_password, from_address, from_name, enabled")
      .limit(1)
      .maybeSingle<EmailSettingsRow>();

    if (settingsError || !settings) {
      console.error("email_settings load error:", settingsError);
      return new Response(JSON.stringify({ error: "Email settings unavailable" }), {
        status: 500,
        headers: jsonHeaders,
      });
    }

    if (!settings.enabled) {
      return new Response(JSON.stringify({ skipped: true, reason: "email disabled" }), {
        status: 200,
        headers: jsonHeaders,
      });
    }

    if (!settings.smtp_host || !settings.smtp_username || !settings.smtp_password || !settings.from_address) {
      return new Response(JSON.stringify({ error: "SMTP configuration incomplete" }), {
        status: 500,
        headers: jsonHeaders,
      });
    }

    const transporter = nodemailer.createTransport({
      host: settings.smtp_host,
      port: settings.smtp_port,
      secure: true, // Hostinger SMTP — port 465 SSL
      auth: {
        user: settings.smtp_username,
        pass: settings.smtp_password,
      },
    });

    const fromHeader = settings.from_name
      ? `"${settings.from_name}" <${settings.from_address}>`
      : settings.from_address;

    // Test mode — send a probe email to from_address, no DB lookup needed.
    if (isTest) {
      const info = await transporter.sendMail({
        from: fromHeader,
        to: settings.from_address,
        subject: "VP-Flow — SMTP Test Connection",
        text: "This is a test email from VP-Flow Settings. If you received this, SMTP is configured correctly.",
        html: "<p>This is a test email from <strong>VP-Flow Settings</strong>.</p><p>If you received this, SMTP is configured correctly.</p>",
      });
      return new Response(JSON.stringify({ sent: 1, test: true, messageId: info.messageId }), {
        status: 200,
        headers: jsonHeaders,
      });
    }

    // Normal trigger-mode payload
    const { userId, title, message, link } = body as {
      userId?: string;
      title?: string;
      message?: string;
      link?: string;
    };

    if (!userId || !title) {
      return new Response(JSON.stringify({ error: "userId and title are required" }), {
        status: 400,
        headers: jsonHeaders,
      });
    }

    // Resolve target user email via auth admin API
    const { data: userResult, error: userError } = await adminClient.auth.admin.getUserById(userId);
    if (userError || !userResult?.user?.email) {
      console.error("auth.admin.getUserById error:", userError);
      return new Response(JSON.stringify({ sent: 0, reason: "user email not found" }), {
        status: 200,
        headers: jsonHeaders,
      });
    }
    const toEmail = userResult.user.email;

    const messageText = message ?? "";
    const linkHtml = link
      ? `<p><a href="${link}">${link}</a></p>`
      : "";
    const linkText = link ? `\n\n${link}` : "";

    const info = await transporter.sendMail({
      from: fromHeader,
      to: toEmail,
      subject: title,
      text: `${title}\n\n${messageText}${linkText}`,
      html: `<h2>${title}</h2><p>${messageText}</p>${linkHtml}`,
    });

    return new Response(JSON.stringify({ sent: 1, messageId: info.messageId }), {
      status: 200,
      headers: jsonHeaders,
    });
  } catch (error) {
    console.error("send-email-notification error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: jsonHeaders },
    );
  }
});
