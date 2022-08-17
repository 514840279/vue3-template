import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 别名配置
  resolve: {
    alias: {
      // 键必须以斜线开始和结束
      '@': path.resolve(__dirname, './src'),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@common": path.resolve(__dirname, "./src/common"),
      "@interface": path.resolve(__dirname, "./src/interface"),
      "@plugins": path.resolve(__dirname, "./src/plugins"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@views": path.resolve(__dirname, "./src/views"),
    },
  },
  build: {
    minify: 'terser',
    // 进行压缩计算
    brotliSize: false,
    // outDir: env.VITE_APP_BASE,
    sourcemap: false,
    // 生产环境移除console
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 4000,
    open: true,
    // 配置代理
    proxy: {
      // 请求的路径前缀只要是 /testaxios 就会被拦截走这个代理
      '/security': {
        /**
          *  请求的目标资源再经过替换成 /httphwm/getList 后，
          *  会加上 http://127.0.0.1:9693 这个前缀，
          *  最后请求的URL为: http://127.0.0.1:9693/httphwm/getList
          */
        target: 'http://127.0.0.1:28001/',
        ws: true,
        changeOrigin: true,
        // 拦截到的请求路径 testaxios/httphwm/getList，/testaxios会被替换成空
        rewrite: (path) => path.replace(/^\/security/, '/security'),
      },
    }

  },

})
