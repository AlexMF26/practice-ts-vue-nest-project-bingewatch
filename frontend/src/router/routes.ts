import { RouteRecordRaw } from 'vue-router';
import { useUserStore } from '../stores/user.store';

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
      },
      {
        path: '/register',
        component: () => import('src/pages/RegisterPage.vue'),
        name: 'register',
      },
      {
        path: '/user/:id',
        component: () => import('src/pages/UserPage.vue'),
        props: (route) => ({ id: route.params.id }),
        name: 'user',
        beforeEnter: (to, _from, next) => {
          const store = useUserStore();
          if (!store.loggedIn) {
            next('/login');
          } else if (to.params.id === store.userId) {
            next();
          } else {
            next('/unauthorized');
          }
        },
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
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    name: '404',
  },
];

export default routes;
