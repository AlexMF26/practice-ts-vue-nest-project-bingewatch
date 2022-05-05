import { RouteRecordRaw } from 'vue-router';
import { identityGuard } from './guards/identity.guard';
import { loggedOutOnlyGuard } from './guards/loggedOutOnly.guard';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/LandingPage.vue'),
        name: 'landing',
      },
      {
        path: '/login',
        component: () => import('src/pages/LoginPage.vue'),
        name: 'login',
        beforeEnter: [loggedOutOnlyGuard],
      },
      {
        path: '/register',
        component: () => import('src/pages/RegisterPage.vue'),
        name: 'register',
        beforeEnter: [loggedOutOnlyGuard],
      },
      {
        path: '/user/:id',
        component: () => import('src/pages/UserPage.vue'),
        props: (route) => ({ id: route.params.id }),
        name: 'user',
        beforeEnter: [identityGuard],
      },
      {
        path: '/entry/:id',
        component: () => import('src/pages/EntryPage.vue'),
        props: (route) => ({ id: route.params.id }),
        name: 'entry',
      },
      {
        path: '/watchlist/:id',
        component: () => import('src/pages/WatchlistPage.vue'),
        props: (route) => ({ id: route.params.id }),
        name: 'watchlist',
      },
    ],
  },
  {
    path: '/unauthorized',
    component: () => import('pages/ErrorUnauthorized.vue'),
    name: 'unauthorized',
  },
  {
    path: '/not-found',
    component: () => import('pages/ErrorNotFound.vue'),
    name: 'not-found',
  },
  {
    path: '/unknown-error',
    component: () => import('pages/UnknownError.vue'),
    name: 'unknown-error',
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    name: 'catch-all',
  },
];

export default routes;
