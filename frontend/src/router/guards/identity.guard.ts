import { useUserStore } from '../../stores/user.store';

export function identityGuard(to, _from, next) {
  const store = useUserStore();
  if (!store.loggedIn) {
    next('/login');
  } else if (to.params.id === store.userId) {
    next();
  } else {
    next('/unauthorized');
  }
}
