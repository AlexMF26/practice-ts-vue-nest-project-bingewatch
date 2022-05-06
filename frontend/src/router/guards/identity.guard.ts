import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';

export function identityGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const store = useAuthStore();
  if (!store.loggedIn) {
    next('/login');
  } else if (to.params.id === store.userId || store.isAdmin) {
    next();
  } else {
    next('/unauthorized');
  }
}
