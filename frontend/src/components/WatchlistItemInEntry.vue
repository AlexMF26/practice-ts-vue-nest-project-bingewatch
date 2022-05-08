<template>
  <div v-if="item.id === ''">
    <q-btn @click="watch()" color="positive">Watch</q-btn>
  </div>
  <div v-else>
    <q-btn @click="unwatch()" color="negative">Unwatch</q-btn>
  </div>
</template>
<script setup lang="ts">
import { debounce } from 'quasar';
import { onBeforeMount, onUpdated, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useWatchlistStore } from '../stores/watchlist.store';
import { WatchlistItemEntity } from '../types/api/interface';

export type Props = {
  entryId: string;
  userId: string;
};
const props = defineProps<Props>();

const store = useWatchlistStore();
const router = useRouter();

const item = ref<WatchlistItemEntity>({
  id: '',
  entryId: '',
  userId: '',
  progress: 0,
  rating: null,
});

async function fetchData() {
  try {
    item.value = await store.getWatchListItem(props.userId, props.entryId);
  } catch (error: any) {
    if (error?.message?.toString()?.includes('401')) {
      router.push('/unauthorized');
    } else if (error?.message?.toString()?.includes('404')) {
      item.value = {
        id: '',
        entryId: '',
        userId: '',
        progress: 0,
        rating: null,
      };
    } else {
      router.push('/unknown-error');
    }
  }
}

const watch = debounce(
  async function () {
    const data = await store.addWatchListItem({
      userId: props.userId,
      imdbId: props.entryId,
    });
    item.value = data;
  },
  500,
  true
);

const unwatch = debounce(
  async function () {
    await store.deleteWatchListItem(item.value.id);
    item.value = {
      id: '',
      entryId: '',
      userId: '',
      progress: 0,
      rating: null,
    };
  },
  500,
  true
);

onBeforeMount(fetchData);
</script>

<style scoped lang="scss">
.q-btn {
  width: 20vh;
}
</style>
