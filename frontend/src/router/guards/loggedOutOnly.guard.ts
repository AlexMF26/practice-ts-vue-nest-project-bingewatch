import { useUserStore } from '../../stores/user.store';

export function loggedOutOnlyGuard(_to, _from, next) {
  const store = useUserStore();
  if (store.loggedIn) {
    next('/');
  }
  next();
}
