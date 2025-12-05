import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // ...existing code...
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
  // ...existing code...
});
