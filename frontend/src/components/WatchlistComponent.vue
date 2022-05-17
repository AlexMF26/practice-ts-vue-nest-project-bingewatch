<template>
  <div class="q-pa-md">
    <q-table :rows="items" row-key="id" :columns="columns">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="title" :props="props">
            <WatchlistItemTitle :id="props.key" />
          </q-td>
          <q-td key="progress" :props="props">
            <WatchlistItemProgress
              :id="props.key"
              :isOwner="componentProps.isOwner"
            />
          </q-td>
          <q-td key="rating" :props="props">
            <WatchlistItemRating
              :id="props.key"
              :isOwner="componentProps.isOwner"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import WatchlistItemTitle from './WatchlistItemTitle.vue';
import WatchlistItemProgress from './WatchlistItemProgress.vue';
import WatchlistItemRating from './WatchlistItemRating.vue';

import { storeToRefs } from 'pinia';
import { useWatchlistStore } from '../stores/watchlist.store';
import { DetailedWatchlistItemEntity } from '../types/api/interface';
import { QTableProps } from 'quasar';

export type Props = {
  isOwner: boolean;
};

const componentProps = defineProps<Props>();

const watchlistStore = useWatchlistStore();
const { items } = storeToRefs(watchlistStore);

const columns: QTableProps['columns'] = [
  {
    name: 'title',
    label: 'Title',
    field: (row: DetailedWatchlistItemEntity) => row.entry.title,
    align: 'center',
  },

  {
    name: 'progress',
    label: 'Progress',
    field: (row: DetailedWatchlistItemEntity) => row.progress,
    align: 'right',
  },
  {
    name: 'rating',
    label: 'Rating',
    field: (row: DetailedWatchlistItemEntity) => row.rating ?? 'N/A',
    align: 'center',
  },
];
</script>
