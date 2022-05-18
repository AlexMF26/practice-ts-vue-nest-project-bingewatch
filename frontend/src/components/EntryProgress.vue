<template>
  <div class="q-ml-md">
    <q-btn
      round
      color="accent"
      icon="remove"
      :disabled="!canRemove"
      @click="remove()"
    />
    {{ userData?.progress }}/{{ maxProgress }}
    <q-btn round color="accent" icon="add" :disabled="!canAdd" @click="add()" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { useEntriesStore } from '../stores/entries.store';
import { useWatchlistStore } from '../stores/watchlist.store';

const entriesStore = useEntriesStore();
const authStore = useAuthStore();
const watchlistStore = useWatchlistStore();

const { entry, userData } = storeToRefs(entriesStore);

const { userId } = storeToRefs(authStore);

const maxProgress = computed(() => {
  if (entry.value?.seasons.length === 0) {
    return 1;
  } else {
    return entry.value?.seasons.reduce((acc, cur) => {
      return acc + cur.episodes;
    }, 0);
  }
});

const canAdd = computed(() => {
  if (
    userData.value?.progress !== undefined &&
    maxProgress.value !== undefined &&
    userData.value?.progress + 1 <= maxProgress.value
  ) {
    return true;
  } else {
    return false;
  }
});

const canRemove = computed(() => {
  if (
    userData.value?.progress !== undefined &&
    maxProgress.value !== undefined &&
    userData.value?.progress - 1 >= 0
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

async function add() {
  await watchlistStore.updateWatchListItem(userData.value?.id as string, {
    progress: 1,
  });
  await refreshData();
}

async function remove() {
  await watchlistStore.updateWatchListItem(userData.value?.id as string, {
    progress: -1,
  });
  await refreshData();
}
</script>
