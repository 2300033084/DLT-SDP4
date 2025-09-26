import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Keep the relative base path fix for Nginx
  base: './', 
  build: {
    // REMOVE THIS LINE (or comment it out) to fix the minification error
    // target: 'es2020', 
  }
});