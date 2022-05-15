<template>
  <q-page> <WatchlistComponent v-if="ready" /></q-page>
</template>

<script setup lang="ts">
import WatchlistComponent from '../components/WatchlistComponent.vue';

import { useWatchlistStore } from '../stores/watchlist.store';
import { onBeforeMount, ref } from 'vue';

export type Props = {
  id: string;
};

const props = defineProps<Props>();

const ready = ref(false);

onBeforeMount(async () => {
  const watchlistStore = useWatchlistStore();
  await watchlistStore.getWatchlist(props.id);
  ready.value = true;
});
</script>
