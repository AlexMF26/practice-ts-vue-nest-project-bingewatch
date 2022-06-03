<template>
  <div class="full-width row justify-evenly">
    <div class="col-auto q-mx-xl text-center">
      <h4 class="text-center">{{ entry?.title }}</h4>
      <PosterComponent :posterUrl="entry?.posterUrl" />
      <div v-if="entry?.seasons.length !== 0">
        <span class="text-h4 q-mt-md q-mr-md">{{ $t('entry.series') }}</span>
        <div>
          <span class="text-h6 q-my-md q-mr-md">{{ $t('entry.seasons') }}:</span
          >{{ entry?.seasons.length }}
        </div>
        <div>
          <span class="text-h6 q-my-md q-mr-md"
            >{{ $t('entry.episodes') }}:</span
          >{{
            entry?.seasons.reduce((acc, cur) => {
              return acc + cur.episodes;
            }, 0)
          }}
        </div>
      </div>
      <div v-else>
        <span class="text-h4 q-mt-md q-mr-md">{{ $t('entry.movie') }}</span>
      </div>
      <div>
        <span class="text-h6 q-my-md q-mr-md">Rating:</span
        >{{ entry?.rating ? entry?.rating.toFixed(2) : 'N/A' }}
      </div>
      <q-btn
        @click="$router.push(`${$route.path}/reviews`)"
        color="accent"
        :label="$t('entry.reviews')"
        class="q-mt-md"
      />
    </div>
    <div class="col-6 q-mx-xl">
      <h4>{{ $t('entry.plot') }}</h4>
      <p>{{ entry?.plot }}</p>
      <WatchlistItemInEntry v-if="loggedIn" />
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
