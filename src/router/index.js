import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import { routes } from './routeltems';
import { setupRoutePermission } from './permission';
// 是否用 hash 模式 以及 base 位置
const { VITE_HASH_ROUTE = 'N', VITE_BASE_URL } = import.meta.env;

const routerInstane = createRouter({
  history: VITE_HASH_ROUTE === 'Y' ? createWebHashHistory(VITE_BASE_URL) : createWebHistory(VITE_BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// export後main.js掛載router後接著執行router路由守衛
export function setupRouter(AppInstance) {
  AppInstance.use(routerInstane);
  setupRoutePermission(routerInstane);
}
