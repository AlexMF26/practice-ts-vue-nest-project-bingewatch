<template>
  {{ item?.progress }}/{{
              item?.entry.seasons.length !== 0
                ? item?.entry.seasons.reduce((acc:number, cur:{episodes:number}) => {
                    return acc + cur.episodes;
                  }, 0)
                : 1
  }}
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useWatchlistStore } from '../stores/watchlist.store';

export type Props = {
  id: string;
  isOwner: boolean;
};

const props = defineProps<Props>();

const watchlistStore = useWatchlistStore();
const { items } = storeToRefs(watchlistStore);
const item = computed(() => items.value.find((i) => i.id === props.id));
</script>
