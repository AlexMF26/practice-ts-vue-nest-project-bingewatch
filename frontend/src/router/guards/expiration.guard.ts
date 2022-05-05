import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useUserStore } from '../../stores/user.store';

export function expirationGuard(
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const userStore = useUserStore();
  if (userStore.expirationCheck()) {
    next('/login');
  }
  next();
}
