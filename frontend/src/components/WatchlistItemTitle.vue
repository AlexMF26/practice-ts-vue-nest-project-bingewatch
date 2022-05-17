<template>
  <q-chip
    color="primary"
    text-color="secondary"
    clickable
    @click="$router.push('/entry/' + item?.entry.imdbId)"
  >
    {{ item?.entry.title }}
  </q-chip>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useWatchlistStore } from '../stores/watchlist.store';

export type Props = {
  id: string;
};

const props = defineProps<Props>();

const watchlistStore = useWatchlistStore();
const { items } = storeToRefs(watchlistStore);
const item = computed(() => items.value.find((i) => i.id === props.id));
</script>
