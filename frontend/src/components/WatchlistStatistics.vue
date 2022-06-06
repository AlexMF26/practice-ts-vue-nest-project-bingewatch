<template>
  <p class="text-subtitle1">
    {{ $t('statistics.itemCount') }}: <b>{{ items.length }}</b>
  </p>
  <p class="text-subtitle1">
    {{ $t('statistics.averageRating') }}: <b>{{ averageRating }}</b>
  </p>
  <p class="text-subtitle1">
    {{ $t('statistics.minutesWatched') }}: <b>{{ minutesWatchedCount }}</b>
  </p>
  <p class="text-subtitle1">
    {{ $t('statistics.moviesCount') }}: <b>{{ moviesCount }}</b>
  </p>
  <p class="text-subtitle1">
    {{ $t('statistics.moviesCompletedCount') }}:
    <b>{{ completedMoviesCount }}</b>
  </p>
  <p class="text-subtitle1">
    {{ $t('statistics.moviesUncompletedCount') }}:
    <b>{{ moviesCount - completedMoviesCount }} </b>
  </p>
  <p class="text-subtitle1">
    {{ $t('statistics.seriesCount') }}:
    <b>{{ items.length - moviesCount }}</b>
  </p>
  <p class="text-subtitle1">
    {{ $t('statistics.seasonsCount') }}: <b>{{ seasonsCount }}</b>
  </p>
  <p class="text-subtitle1">
    {{ $t('statistics.episodesWatchedCount') }}:
    <b>{{ episodesWatchedCount }} </b>
  </p>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useWatchlistStore } from '../stores/watchlist.store';

const watchlistStore = useWatchlistStore();

const { items } = storeToRefs(watchlistStore);

const moviesCount = computed(() =>
  items.value.reduce((acc, item) => {
    if (item.entry.seasons.length === 0) {
      return acc + 1;
    }
    return acc;
  }, 0)
);

const completedMoviesCount = computed(() =>
  items.value.reduce((acc, item) => {
    if (item.entry.seasons.length === 0 && item.progress === 1) {
      return acc + 1;
    }
    return acc;
  }, 0)
);

const episodesWatchedCount = computed(() =>
  items.value.reduce((acc, item) => {
    if (item.entry.seasons.length > 0) {
      return acc + item.progress;
    }
    return acc;
  }, 0)
);

const minutesWatchedCount = computed(() =>
  items.value.reduce((acc, item) => {
    if (item.entry.runtime != 'N/A') {
      return (
        acc + item.progress * Number.parseInt(item.entry.runtime.split(' ')[0])
      );
    }
    return acc;
  }, 0)
);

const ratingsCount = computed(() =>
  items.value.reduce((acc, item) => {
    if (item.rating != null) {
      return acc + 1;
    }
    return acc;
  }, 0)
);

const averageRating = computed(() => {
  const ratings = items.value.reduce((acc, item) => {
    if (item.rating != null) {
      return acc + item.rating;
    }
    return acc;
  }, 0);
  return ratingsCount.value === 0 ? 'N/A' : ratings / ratingsCount.value;
});

const seasonsCount = computed(() =>
  items.value.reduce((acc, item) => {
    if (item.entry.seasons.length > 0) {
      return acc + item.entry.seasons.length;
    }
    return acc;
  }, 0)
);
</script>
