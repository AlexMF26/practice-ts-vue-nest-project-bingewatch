import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { useUserStore } from '../../stores/user.store';

export function loggedOutOnlyGuard(
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const store = useUserStore();
  if (store.loggedIn) {
    next('/');
  }
  next();
}
