import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'vp-flow-logo-dark.svg',
        'vp-flow-logo-light.svg',
        'vp-flow-icon.svg',
        'vp-flow-icon-boxed.svg',
        'favicon-16.png',
        'favicon-32.png',
        'icon-192.png',
        'icon-512.png',
        'icon-512-maskable.png',
      ],
      manifest: {
        name: 'VP-Flow',
        short_name: 'VP-Flow',
        description: 'Appointment and Case Management System for the Office of the Vice President',
        theme_color: '#7e67fe',
        background_color: '#191e23',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        // App shell caching ONLY - no API caching
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        // Explicitly exclude API routes and data
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/rest/],
        // No runtime caching of API responses (READ-ONLY offline enforcement)
        runtimeCaching: [],
        // C2: Enhanced cache management
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        // C2: Size limit to prevent accidental large file caching
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        // v2.0: Import push notification handler into service worker
        importScripts: ['/sw-push.js'],
      },
      devOptions: { enabled: true, type: 'module' }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'color-functions', 'if-function'],
        quietDeps: true,
      },
    },
  },
}));
