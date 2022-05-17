<template>
  <div v-if="props.isOwner">
    <q-select
      v-if="!loading"
      v-model="newRating"
      :options="ratings"
      label="Your rating"
      filled
      dense
    ></q-select>
    <span v-else>Loading...</span>
  </div>

  <div v-else>{{ item?.rating ?? 'N/A' }}</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref, watchEffect } from 'vue';
import { useWatchlistStore } from '../stores/watchlist.store';

export type Props = {
  id: string;
  isOwner: boolean;
};

const props = defineProps<Props>();

const watchlistStore = useWatchlistStore();
const { items } = storeToRefs(watchlistStore);
const item = computed(() => items.value.find((i) => i.id === props.id));

const newRating = ref<number | null>(null);

newRating.value = item.value?.rating ?? null;

const ratings = [null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const loading = ref(false);

watchEffect(async () => {
  if (props.isOwner) {
    loading.value = true;
    await watchlistStore.updateWatchListItem(props.id, {
      rating: newRating.value as number,
    });
    await new Promise((resolve) => setTimeout(resolve, 200));
    loading.value = false;
  }
});
</script>
