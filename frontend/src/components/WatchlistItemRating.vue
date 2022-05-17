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

const getLabel = (rating: number | null) =>
  rating === null ? 'N/A' : `${rating}`;

const newRating = ref<{
  value: number | null;
  label: ReturnType<typeof getLabel>;
}>({
  value: item.value?.rating ?? null,
  label: getLabel(item.value?.rating ?? null),
});

const ratings = [
  { value: null, label: getLabel(null) },
  { value: 1, label: getLabel(1) },
  { value: 2, label: getLabel(2) },
  { value: 3, label: getLabel(3) },
  { value: 4, label: getLabel(4) },
  { value: 5, label: getLabel(5) },
  { value: 6, label: getLabel(6) },
  { value: 7, label: getLabel(7) },
  { value: 8, label: getLabel(8) },
  { value: 9, label: getLabel(9) },
  { value: 10, label: getLabel(10) },
];

const loading = ref(false);

watchEffect(async () => {
  if (props.isOwner) {
    loading.value = true;
    await watchlistStore.updateWatchListItem(props.id, {
      rating: newRating.value.value as number,
    });
    await new Promise((resolve) => setTimeout(resolve, 200));
    loading.value = false;
  }
});
</script>
