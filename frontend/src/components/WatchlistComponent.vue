<template>
  <div v-for="item in items" :key="item.id">{{ item.entry.title }}<br /></div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useWatchlistStore } from '../stores/watchlist.store';

const watchlistStore = useWatchlistStore();
const { items } = storeToRefs(watchlistStore);
</script>
