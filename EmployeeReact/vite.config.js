import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Set the base path for your application in the Docker container
  // CHANGE THIS: Use './' (relative path) instead of '/' (absolute path)
  base: './', // <-- UPDATED LINE
  build: {
    // This setting ensures that the output is compatible with older browsers if needed
    target: 'es2020',
  }
});