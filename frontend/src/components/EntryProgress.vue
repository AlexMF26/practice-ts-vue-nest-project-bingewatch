<template>
  <div class="row items-center justify-evenly">
    <q-btn
      round
      color="accent"
      icon="remove"
      :disable="!canRemove"
      @click="remove()"
      style="margin-right: 0.4vw"
    />
    <span v-if="type == 'movie'" class="text-center col-12 col-sm-auto">
      {{
        userData?.progress === 1
          ? $t('entry.completed')
          : $t('entry.notCompleted')
      }}
    </span>
    <span v-else class="text-center col-12 col-sm-auto"
      >{{ userData?.progress }}/{{ maxProgress }}</span
    >
    <q-btn
      round
      color="accent"
      icon="add"
      :disable="!canAdd"
      @click="add()"
      style="margin-left: 0.4vw"
    />
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
const type = computed(() =>
  entry.value?.seasons.length !== 0 ? 'series' : 'movie'
);

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
