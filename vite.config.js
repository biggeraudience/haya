import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Import global mixins or variables, not full component styles
        additionalData: `@use "./src/styles/_mixins.scss";`, // Adjust path as needed
      },
    },
  },
  resolve: {
    alias: {
      'react-map-gl': 'react-map-gl/dist/esm',
    },
  },
  build: {
    outDir: 'dist', // Ensure the build output is in the 'dist' directory
  },
});
