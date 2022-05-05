import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useUserStore } from '../../stores/user.store';

export function identityGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const store = useUserStore();
  if (!store.loggedIn) {
    next('/login');
  } else if (to.params.id === store.userId || store.isAdmin) {
    next();
  } else {
    next('/unauthorized');
  }
}
