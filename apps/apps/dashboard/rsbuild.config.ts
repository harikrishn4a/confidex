// rsbuild.config.ts
import { defineConfig } from '@rsbuild/core';

export default defineConfig({
  server: {
    host: '0.0.0.0',   // expose on your network
    port: 5173,        // pick any free port
  },
});
