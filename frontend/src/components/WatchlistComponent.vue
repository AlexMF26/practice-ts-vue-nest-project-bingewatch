<template>
  <div v-for="item in watchlist" :key="item.id">
    {{ item.entry.title }}<br />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useWatchlistStore } from '../stores/watchlist.store';
import { DetailedWatchlistItemEntity } from '../types/api/interface';

export type Props = {
  id: string;
};

const props = defineProps<Props>();

const router = useRouter();
const watchlistStore = useWatchlistStore();
const watchlist = ref<DetailedWatchlistItemEntity[]>([]);

async function fetchData() {
  try {
    watchlist.value = await watchlistStore.getWatchlist(props.id);
  } catch (error) {
    if (error instanceof Error && error.message.includes('401')) {
      router.push('/unauthorized');
    } else if (error instanceof Error && error.message.includes('404')) {
      router.push('/not-found');
    } else {
      router.push('/unknown-error');
    }
  }
}

onBeforeMount(fetchData);
</script>
