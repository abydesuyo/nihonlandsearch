import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Custom plugin to handle Suumo API requests server-side to avoid CORS
const suumoProxyPlugin = (): Plugin => ({
  name: 'suumo-proxy',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url?.startsWith('/suumo-api')) {
        try {
          // Dynamic import of axios
          const { default: axios } = await import('axios');

          const targetUrl = 'https://suumo.jp' + req.url.replace('/suumo-api', '');
          console.log('Proxying request to:', targetUrl);

          const response = await axios.get(targetUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
              'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
              'Accept-Encoding': 'gzip, deflate, br',
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            },
            maxRedirects: 5,
            validateStatus: (status) => status < 500, // Accept redirects
          });

          console.log(`Proxy response status: ${response.status}, data length: ${response.data.length}`);

          // Set CORS headers
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
          res.setHeader('Content-Type', 'text/html; charset=UTF-8');

          // Forward Set-Cookie headers if present
          if (response.headers['set-cookie']) {
            res.setHeader('Set-Cookie', response.headers['set-cookie']);
          }

          res.writeHead(200);
          res.end(response.data);
        } catch (error) {
          console.error('Proxy error:', error);
          res.writeHead(500);
          res.end('Internal Server Error');
        }
      } else {
        next();
      }
    });
  }
});

export default defineConfig({
  plugins: [react(), suumoProxyPlugin()],
})