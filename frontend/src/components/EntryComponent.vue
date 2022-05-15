<template>
  <div class="full-width row justify-between">
    <div class="col-6 offset-1 unit">
      <h6>Plot</h6>
      <p>{{ entry?.plot }}</p>
      <WatchlistItemInEntry v-if="loggedIn" />
    </div>
    <div class="col-4 offset-1 unit">
      <h4>{{ entry?.title }}</h4>
      <PosterComponent :posterUrl="entry?.posterUrl" />
      <div v-if="entry?.seasons.length !== 0">
        <div>
          <span class="text-h6 q-my-md q-mr-md">Seasons:</span
          >{{ entry?.seasons.length }}
        </div>
        <div>
          <span class="text-h6 q-my-md q-mr-md">Episodes:</span
          >{{
            entry?.seasons.reduce((acc, cur) => {
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

import { useEntriesStore } from '../stores/entries.store';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/auth.store';

const entriesStore = useEntriesStore();
const authStore = useAuthStore();

const { loggedIn } = storeToRefs(authStore);
const { entry } = storeToRefs(entriesStore);
</script>
