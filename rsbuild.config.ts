import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [pluginReact()],
  server: {
    proxy: [
      {
        context: ['/images/', '/api/'],
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    ],
  },
});
