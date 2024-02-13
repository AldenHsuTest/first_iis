// 設定路由
export const routes = [
  {
    path: '/',
    name: 'DefaultLayout',
    component: () => import('../layout/DefaultLayout.vue'),
    children: [
      {
        path: '/',
        name: 'Order',
        component: () => import('../pages/Order/Index.vue'),
      },
      {
        path: '/Order/:id',
        name: 'Order_id',
        component: () => import('../pages/Order/_id.vue'),
      },
      {
        path: '/Record',
        name: 'Record',
        component: () => import('../pages/Record/Index.vue'),
      },
    ],
  },
  {
    path: '/',
    name: 'AuthLayout',
    component: () => import('../layout/AuthLayout.vue'),
    children: [
      {
        path: 'Login',
        name: 'Login',
        component: () => import('../pages/Login.vue'),
      },
      {
        path: 'Signup',
        name: 'Signup',
        component: () => import('../pages/Signup.vue'),
      },
      {
        path: 'Forget',
        name: 'Forget',
        component: () => import('../pages/Forget.vue'),
      },
      {
        path: 'Info',
        name: 'Info',
        meta: { requireAuth: true },
        component: () => import('../pages/User/Info.vue'),
      },
      {
        path: 'resetPwd',
        name: 'resetPwd',
        meta: { requireAuth: true },
        component: () => import('../pages/User/ResetPwd.vue'),
      },
      {
        path: 'Edit',
        name: 'Edit',
        meta: { requireAuth: true },
        component: () => import('../pages/User/Edit.vue'),
      },
    ],
  },
  {
    path: '/header',
    name: 'header',
    component: () => import('../components/layouts/Header.vue'),
  },
  {
    path: '/footer',
    name: 'footer',
    component: () => import('../components/layouts/Footer.vue'),
  },
];
