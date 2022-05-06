import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';

export function loggedOutOnlyGuard(
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const store = useAuthStore();
  if (store.loggedIn) {
    next('/');
  }
  next();
}
