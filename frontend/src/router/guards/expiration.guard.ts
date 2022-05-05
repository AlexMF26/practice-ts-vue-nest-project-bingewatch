import { useUserStore } from '../../stores/user.store';

export function expirationGuard(_to, _from, next) {
  const userStore = useUserStore();
  if (userStore.expirationCheck()) {
    next('/login');
  }
  next();
}
