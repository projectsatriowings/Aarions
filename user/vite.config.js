import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function nonBlockingCssPlugin() {
  return {
    name: 'vite-plugin-non-blocking-css',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace(
        /<link\s+rel="stylesheet"\s+([^>]*?)href="([^"]+\.css)"([^>]*)>/gi,
        (match, p1, href, p2) => {
          return `<link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'" ${p1}${p2}>\n    <noscript><link rel="stylesheet" href="${href}" ${p1}${p2}></noscript>`;
        }
      );
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nonBlockingCssPlugin()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor';
            }
          }
        }
      }
    }
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
})
