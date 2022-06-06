<template>
  <div style="max-width: 95vw; margin: auto; margin-top: 4vh">
    <q-table
      :rows="items"
      row-key="id"
      :columns="columns"
      :sort-method="customSort"
      :pagination="{ sortBy: 'title' }"
      :rows-per-page-options="[0]"
      :no-data-label="$t('watchlist.noItems')"
      hide-pagination
      dense
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="title" :props="props">
            <WatchlistItemTitle :id="props.key" />
          </q-td>
          <q-td key="rated" :props="props">
            {{ props.row.entry.rated }}
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
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

export type Props = {
  isOwner: boolean;
};

const componentProps = defineProps<Props>();

const watchlistStore = useWatchlistStore();
const { items } = storeToRefs(watchlistStore);
const { t } = useI18n({ useScope: 'global' });

const columns = computed<QTableProps['columns']>(() => [
  {
    name: 'title',
    label: t('watchlist.title'),
    field: (row: DetailedWatchlistItemEntity) => row.entry.title,
    align: 'center',
  },
  {
    name: 'rated',
    label: t('watchlist.rated'),
    field: (row: DetailedWatchlistItemEntity) => row.entry.rated,
    align: 'center',
  },
  {
    name: 'progress',
    label: t('watchlist.progress'),
    field: (row: DetailedWatchlistItemEntity) => row.progress,
    align: 'center',
  },
  {
    name: 'rating',
    label: t('watchlist.rating'),
    field: (row: DetailedWatchlistItemEntity) => row.rating ?? 'N/A',
    align: 'center',
  },
]);

function customSort(rows: readonly DetailedWatchlistItemEntity[]) {
  const data = [...rows];

  data.sort(
    (a: DetailedWatchlistItemEntity, b: DetailedWatchlistItemEntity) => {
      return a.entry.title < b.entry.title ? -1 : 1;
    }
  );
  return data as readonly DetailedWatchlistItemEntity[];
}
</script>
