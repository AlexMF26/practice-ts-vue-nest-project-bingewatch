<template>
  <q-page>
    <h2 class="text-center" v-if="ready">
      {{ $t('watchlist.header', { username: userName }) }}
    </h2>
    <WatchlistComponent v-if="ready" :isOwner="isOwner"
  /></q-page>
</template>

<script setup lang="ts">
import WatchlistComponent from '../components/WatchlistComponent.vue';

import { useWatchlistStore } from '../stores/watchlist.store';
import { computed, onBeforeMount, ref } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { storeToRefs } from 'pinia';
import { useUsersStore } from '../stores/users.store';

export type Props = {
  id: string;
};

const props = defineProps<Props>();

const ready = ref(false);

const authStore = useAuthStore();

const { userId } = storeToRefs(authStore);

const isOwner = computed(() => {
  return userId.value === props.id;
});

const userName = ref('');

onBeforeMount(async () => {
  const watchlistStore = useWatchlistStore();
  await watchlistStore.getWatchlist(props.id);
  const userStore = useUsersStore();
  const user = await userStore.getUser(props.id);
  userName.value = user.name;
  ready.value = true;
});
</script>

<style lang="scss" scoped>
h2 {
  color: $accent;
}
</style>
