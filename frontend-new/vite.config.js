import { defineConfig } from 'vite'
import createVitePlugins from './vite/plugins'

export default defineConfig(({ mode, command }) => {
  const isBuild = command === 'build'

  return {
    plugins: createVitePlugins({ VITE_BUILD_COMPRESS: 'gzip' }, isBuild),
    resolve: {
      alias: {
        '@': '/src'
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    server: {
      port: 5173,
      strictPort: false,
      proxy: {
        '/dev-api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/dev-api/, '/api')
        }
      }
    },
    build: {
      outDir: '../../WWW',
      emptyOutDir: true,
      // 解决 Node.js heap out of memory 问题
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks: {
            'element-plus': ['element-plus'],
            'echarts': ['echarts'],
          }
        }
      }
    }
  }
})
