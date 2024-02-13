import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';
import path from 'path';
// vite-plugin-eslint
import eslintPlugin from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const viteEnv = loadEnv(mode, process.cwd());

  console.log('====================模式與環境====================');
  console.log('env', viteEnv);
  console.log('command', command);
  console.log('mode', mode);
  console.log('=================================================');
  return {
    base: viteEnv.VITE_BASE_URL,
    plugins: [
      vue(),
      UnoCSS(),
      eslintPlugin({
        include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue'],
        fix: true,
      }),
    ],
    resolve: {
      alias: [
        { find: '@', replacement: `${path.resolve(process.cwd())}/src` },
      ],
    },
    server: {
      open: true,
      proxy: {
        '/service/api/': {
          target: 'http://sbir.cbsdinfo.com.tw/',
          changeOrigin: true,
          rewrite: (pathe) => pathe.replace(/^\/service^\/^\/api/, ''),
        },
      },
    },
  };
});
