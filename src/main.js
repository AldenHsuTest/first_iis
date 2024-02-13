/* eslint-disable import/no-unresolved */
import { createApp } from 'vue';
import '@unocss/reset/tailwind.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhTw from 'element-plus/dist/locale/zh-tw.mjs';
import './assets/main.css';
import 'virtual:uno.css';
import {
  setupVeeValidator, setupFontAwesome, setupSwal, setupDayjs, setupDatepicker, setupLoader, setupGsap,
} from '@/plugins';
import { setupPinia } from './stores/index';

import App from './App.vue';
import { setupRouter } from './router/index';

async function setupApp() {
  const AppInstance = createApp(App);

  AppInstance.use(ElementPlus, { locale: zhTw });

  setupPinia(AppInstance);

  setupVeeValidator(AppInstance);

  setupDatepicker(AppInstance);

  setupLoader(AppInstance);

  setupSwal(AppInstance);

  setupDayjs(AppInstance);

  setupGsap(AppInstance);

  setupFontAwesome(AppInstance);

  await setupRouter(AppInstance); // 一般的router

  AppInstance.mount('#app');
}

setupApp();
