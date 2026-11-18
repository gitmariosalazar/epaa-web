import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('@deck.gl') ||
              id.includes('deck.gl') ||
              id.includes('luma.gl') ||
              id.includes('@math.gl') ||
              id.includes('@loaders.gl')
            ) {
              return 'vendor-deckgl';
            }
            if (id.includes('@react-pdf') || id.includes('jspdf')) {
              return 'vendor-pdf';
            }
            if (id.includes('xlsx')) {
              return 'vendor-xlsx';
            }
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'vendor-charts';
            }
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'vendor-mui';
            }
            if (id.includes('@vis.gl/react-google-maps')) {
              return 'vendor-maps';
            }
            if (id.includes('react-icons') || id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('react-syntax-highlighter')) {
              return 'vendor-highlighter';
            }
          }
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true,
    open: false,
    hmr: {
      clientPort: 5173
    }
  }
});
