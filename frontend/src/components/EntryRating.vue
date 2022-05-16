<template>
  <div class="row">
    <q-select
      v-model="newRating"
      :options="ratings"
      label="Your rating"
      filled
      dense
      class="col-grow q-mr-md"
    ></q-select>
    <q-btn
      v-if="canUpdate"
      label="Update"
      color="accent"
      @click="update"
      class="col-auto"
    ></q-btn>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from '@vue/reactivity';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/auth.store';
import { useEntriesStore } from '../stores/entries.store';
import { useWatchlistStore } from '../stores/watchlist.store';

const entriesStore = useEntriesStore();
const authStore = useAuthStore();
const watchlistStore = useWatchlistStore();

const { entry, userData } = storeToRefs(entriesStore);

const { userId } = storeToRefs(authStore);

const newRating = ref<number | null>(userData.value?.rating ?? null);

const ratings = [null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const canUpdate = computed(() => {
  if (userData.value !== null && userData.value?.rating !== newRating.value) {
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
    rating: newRating.value as number | undefined,
  });
  await refreshData();
}
</script>
