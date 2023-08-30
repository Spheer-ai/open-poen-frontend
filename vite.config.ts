import react from '@vitejs/plugin-react';

export default {
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 8000, // Change the port to 8000
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000', // Your API server address
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove '/api' prefix
      },
    },
  },
};