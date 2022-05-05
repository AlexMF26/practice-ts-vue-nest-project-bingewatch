import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/LandingPage.vue') },
      {
        path: '/login',
        component: () => import('src/pages/LoginPage.vue'),
      },
      {
        path: '/register',
        component: () => import('src/pages/RegisterPage.vue'),
      },
      {
        path: '/user/:id',
        component: () => import('src/pages/UserPage.vue'),
        props: (route) => ({ id: route.params.id }),
      },
      {
        path: '/entry/:id',
        component: () => import('src/pages/EntryPage.vue'),
        props: (route) => ({ id: route.params.id }),
      },
      {
        path: '/watchlist/:id',
        component: () => import('src/pages/WatchlistPage.vue'),
        props: (route) => ({ id: route.params.id }),
      },
    ],
  },
  {
    path: '/unauthorized',
    component: () => import('pages/ErrorUnauthorized.vue'),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
