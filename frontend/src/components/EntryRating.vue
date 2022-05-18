<template>
  <div class="row">
    <q-select
      v-model="newRating"
      :options="ratings"
      label="Your rating"
      filled
      dense
      class="col-12 col-sm-grow q-mt-lg"
    ></q-select>
    <q-btn
      v-if="canUpdate"
      label="Update"
      color="accent"
      @click="update"
      class="col-12 col-sm-auto q-mt-lg offset-0 offset-sm-1"
    ></q-btn>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { useEntriesStore } from '../stores/entries.store';
import { useWatchlistStore } from '../stores/watchlist.store';

const entriesStore = useEntriesStore();
const authStore = useAuthStore();
const watchlistStore = useWatchlistStore();

const { entry, userData } = storeToRefs(entriesStore);

const { userId } = storeToRefs(authStore);

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

const canUpdate = computed(() => {
  if (
    userData.value !== null &&
    userData.value?.rating !== newRating.value.value
  ) {
    return true;
  } else {
    return false;
  }
});

async function refreshData() {
  await entriesStore.getUserData(
    entry.value?.imdbId as string,
    userId.value as string
  );
}

async function update() {
  await watchlistStore.updateWatchListItem(userData.value?.id as string, {
    rating: newRating.value.value as number | undefined,
  });
  await refreshData();
}
</script>
