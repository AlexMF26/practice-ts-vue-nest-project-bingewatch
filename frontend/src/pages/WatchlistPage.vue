<template>
  <h2 class="text-center">{{ userName }}'s Watchlist</h2>
  <q-page> <WatchlistComponent v-if="ready" :isOwner="isOwner" /></q-page>
</template>

<script setup lang="ts">
import WatchlistComponent from '../components/WatchlistComponent.vue';

import { useWatchlistStore } from '../stores/watchlist.store';
import { computed, onBeforeMount, ref } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { storeToRefs } from 'pinia';

export type Props = {
  id: string;
};

const props = defineProps<Props>();

const ready = ref(false);

const authStore = useAuthStore();

const { userId, userName } = storeToRefs(authStore);

const isOwner = computed(() => {
  return userId.value === props.id;
});

onBeforeMount(async () => {
  const watchlistStore = useWatchlistStore();
  await watchlistStore.getWatchlist(props.id);
  ready.value = true;
});
</script>

<style lang="scss" scoped>
h2 {
  color: $accent;
}
</style>
