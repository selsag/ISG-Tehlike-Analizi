import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// SECURITY NOTE: API keys should NEVER be embedded in the build.
// This configuration has been updated to remove the insecure 'define' option
// that was previously injecting API keys into the bundled JavaScript.
// 
// For local development, users can use a .env file with VITE_API_KEY.
// For production, consider implementing one of these secure approaches:
// - A backend API service that keeps API keys server-side
// - Allow users to provide their own API keys through the application UI
// - Use environment-specific configurations that don't embed secrets

export default defineConfig({
  base: '/ISG-Tehlike-Analizi/',
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
