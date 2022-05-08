<template>
  <div class="full-width row justify-between">
    <div class="col-6 offset-1 unit">
      <h6>Plot</h6>
      <p>{{ entry.plot }}</p>
      <WatchlistItemInEntry
        :entryId="props.id"
        :userId="userId"
        v-if="loggedIn"
      />
    </div>
    <div class="col-4 offset-1 unit">
      <h4>{{ entry.title }}</h4>
      <PosterComponent :posterUrl="entry.posterUrl" />
      <div v-if="entry.seasons.length !== 0">
        <div>
          <span class="text-h6 q-my-md q-mr-md">Seasons:</span
          >{{ entry.seasons.length }}
        </div>
        <div>
          <span class="text-h6 q-my-md q-mr-md">Episodes:</span
          >{{
            entry.seasons.reduce((acc, cur) => {
              return acc + cur.episodes;
            }, 0)
          }}
        </div>
      </div>
      <div v-else>
        <span class="text-h6 q-mt-md q-mr-md">Movie</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PosterComponent from './PosterComponent.vue';
import WatchlistItemInEntry from './WatchlistItemInEntry.vue';

import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useEntriesStore } from '../stores/entries.store';
import { EntryEntity } from '../types/api/interface';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/auth.store';

export type Props = {
  id: string;
};

const props = defineProps<Props>();

const router = useRouter();
const entriesStore = useEntriesStore();
const authStore = useAuthStore();
const entry = ref<EntryEntity>({
  imdbId: '',
  title: '',
  posterUrl: '',
  plot: '',
  seasons: [],
  rating: 0,
});

const { userId, loggedIn } = storeToRefs(authStore);

async function fetchData() {
  try {
    entry.value = await entriesStore.get(props.id);
  } catch (error: any) {
    if (error?.message?.toString()?.includes('401')) {
      router.push('/unauthorized');
    } else if (error?.message?.toString()?.includes('404')) {
      router.push('/not-found');
    } else {
      router.push('/unknown-error');
    }
  }
}

onBeforeMount(fetchData);
</script>
