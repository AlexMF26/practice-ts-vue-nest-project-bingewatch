<template>
  <div
    class="row items-center"
    :class="props.isOwner ? 'justify-between' : 'justify-evenly'"
  >
    <q-btn
      dense
      color="primary"
      icon="remove"
      round
      text-color="secondary"
      :disable="(item?.progress ?? 0) <= 0"
      @click="remove"
      v-if="props.isOwner"
      class="offset-5 offset-sm-0"
    />
    <div v-if="type == 'movie'" class="text-center col-12 col-sm-auto">
      {{
        item?.progress === 1
          ? $t('watchlist.completed')
          : $t('watchlist.uncompleted')
      }}
    </div>
    <div v-else class="text-center col-12 col-sm-auto">
      {{ item?.progress }}/{{ maxProgress }}
    </div>
    <q-btn
      dense
      color="primary"
      icon="add"
      round
      text-color="secondary"
      :disable="(item?.progress ?? 0) >= (maxProgress ?? 1)"
      @click="add"
      v-if="props.isOwner"
      class="offset-5 offset-sm-0"
    />
  </div>
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
const maxProgress = computed(() =>
  item.value?.entry.seasons.length !== 0
    ? item.value?.entry.seasons.reduce(
        (acc: number, cur: { episodes: number }) => {
          return acc + cur.episodes;
        },
        0
      )
    : 1
);
const type = computed(() =>
  item.value?.entry.seasons.length !== 0 ? 'series' : 'movie'
);

async function add() {
  await watchlistStore.updateWatchListItem(props.id, {
    progress: (item.value?.progress ?? 0) + 1,
  });
}

async function remove() {
  await watchlistStore.updateWatchListItem(props.id, {
    progress: (item.value?.progress ?? 0) - 1,
  });
}
</script>
