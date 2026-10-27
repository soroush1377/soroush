import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base44 preview mode: the sandbox proxy forwards the sandbox hostname
// (`<port>-<sandbox id>.$BASE44_SANDBOX_HOST_DOMAIN`), which changes on every
// environment recreation, so the host allowlist must use the domain wildcard.
// With BASE44_PREVIEW_MODE unset the dev server keeps Vite's default behaviour.
const previewMode = process.env.BASE44_PREVIEW_MODE === '1';
const sandboxHostDomain = process.env.BASE44_SANDBOX_HOST_DOMAIN;
const allowedHosts = previewMode && sandboxHostDomain ? [`.${sandboxHostDomain}`] : undefined;

const apiProxyTarget = process.env.API_PROXY_TARGET || 'http://localhost:8000';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts,
    // Bind mounts do not always emit inotify events in the sandbox.
    watch: previewMode ? { usePolling: true, interval: 300 } : undefined,
    // Single-origin wiring: the browser only ever talks to port 3000, the dev
    // server proxies API calls to the backend service.
    proxy: {
      '/api': { target: apiProxyTarget, changeOrigin: true },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
