<template>
  <q-btn @click="watch()" color="positive" v-if="userData === null">{{
    $t('entry.watch')
  }}</q-btn>
  <q-btn @click="unwatch()" color="negative" v-else>{{
    $t('entry.unwatch')
  }}</q-btn>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { debounce } from 'quasar';
import { useAuthStore } from '../stores/auth.store';
import { useEntriesStore } from '../stores/entries.store';
import { useWatchlistStore } from '../stores/watchlist.store';

const entriesStore = useEntriesStore();
const authStore = useAuthStore();
const watchlistStore = useWatchlistStore();

const { entry, userData } = storeToRefs(entriesStore);

const { userId } = storeToRefs(authStore);

async function refreshData() {
  await entriesStore.getUserData(
    entry.value?.imdbId as string,
    userId.value as string
  );
}

const watch = debounce(
  async function () {
    await watchlistStore.addWatchListItem({
      userId: userId.value as string,
      imdbId: entry.value?.imdbId as string,
    });
    await refreshData();
  },
  500,
  true
);

const unwatch = debounce(
  async function () {
    await watchlistStore.deleteWatchListItem(userData.value?.id as string);
    await refreshData();
  },
  500,
  true
);
</script>
