<template>
  <q-select
    v-if="!loading"
    v-model="newRating"
    :options="ratings"
    :label="$t('watchlist.rating')"
    filled
    dense
  ></q-select>
  <span v-else>{{ $t('watchlist.loading') }}</span>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, watchEffect } from 'vue';
import { useEntriesStore } from '../stores/entries.store';
import { useWatchlistStore } from '../stores/watchlist.store';

const entriesStore = useEntriesStore();
const watchlistStore = useWatchlistStore();

const { userData } = storeToRefs(entriesStore);

const loading = ref(false);

const getLabel = (rating: number | null) =>
  rating === null ? 'N/A' : `${rating}`;

const newRating = ref<{
  value: number | null;
  label: ReturnType<typeof getLabel>;
}>({
  value: userData.value?.rating ?? null,
  label: getLabel(userData.value?.rating ?? null),
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

watchEffect(async () => {
  if (
    userData.value != null &&
    newRating.value.value !== userData.value.rating
  ) {
    loading.value = true;
    await watchlistStore.updateWatchListItem(userData.value?.id as string, {
      rating: newRating.value.value as number | undefined,
    });
    await new Promise((resolve) => setTimeout(resolve, 200));
    loading.value = false;
  }
});
</script>
