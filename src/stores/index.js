import { createPinia } from 'pinia';

export function setupPinia(AppInstance) {
  const pinia = createPinia();
  AppInstance.use(pinia);
}

export * from './userAurhStore';
