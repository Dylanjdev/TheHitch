import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  base: '/',
  build: isSsrBuild ? {} : {
    rollupOptions: {
      input: {
        home: 'index.html',
        hospitals: 'hospitals.html',
        manufacturing: 'manufacturing.html',
        notFound: '404.html',
      },
    },
  },
}))
