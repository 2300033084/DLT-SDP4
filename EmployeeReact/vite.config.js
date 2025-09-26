import { defineConfig } from 'vite';
import reactSwc from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [reactSwc()],
  // Keep the relative base path fix for Nginx
  base: './', 
  build: {
    // REMOVE THIS LINE (or comment it out) to fix the minification error
    // target: 'es2020', 
  }
});