import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// SECURITY NOTE: API keys should NEVER be embedded in the build.
// This configuration has been updated to remove the insecure 'define' option
// that was previously injecting API keys into the bundled JavaScript.
// 
// Users should provide their own API keys at runtime through the application UI
// or via environment variables for local development only (never in production builds).

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});
