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
        <span class="text-h6 q-my-md q-mr-md">{{ $t('entry.year') }}:</span>
        <span>{{ entry?.year }}</span>
      </div>
      <div>
        <span class="text-h6 q-my-md q-mr-md">{{ $t('entry.rated') }}:</span>
        <span>{{ entry?.rated }}</span>
      </div>
      <div>
        <span class="text-h6 q-my-md q-mr-md">{{ $t('entry.runtime') }}:</span>
        <span
          >{{ entry?.runtime
          }}{{
            entry?.seasons.length !== 0 ? ` ${$t('entry.perEpisodes')}` : ''
          }}</span
        >
      </div>
      <div>
        <span class="text-h6 q-my-md q-mr-md">{{ $t('entry.rating') }}:</span
        >{{ entry?.rating ? entry?.rating.toFixed(2) : 'N/A' }}
      </div>
      <q-btn
        @click="$router.push(`${$route.path}/reviews`)"
        color="primary"
        :label="$t('entry.reviews')"
        class="q-mt-md"
      />
      <WatchlistItemInEntry v-if="loggedIn" class="q-mt-md" />
    </div>
    <div class="col-6 q-mx-xl">
      <h4>{{ $t('entry.plot') }}</h4>
      <p class="text-h5">{{ entry?.plot }}</p>
      <span class="text-h4">{{ `${$t('entry.awards')}: ` }}</span>
      <p class="text-h6 q-md-xl q-mt-sm">{{ entry?.awards }}</p>
      <div>
        <span class="text-h6">{{ $t('entry.genre') }}</span>
      </div>
      <q-chip
        :label="genre"
        v-for="genre in entry?.genre"
        :key="genre"
        color="primary"
        text-color="secondary"
        :ripple="false"
        size="xl"
      />
      <div class="q-mt-md">
        <span class="text-h6">{{ $t('entry.language') }}</span>
      </div>
      <q-chip
        :label="language"
        v-for="language in entry?.language"
        :key="language"
        color="primary"
        text-color="secondary"
        :ripple="false"
        size="xl"
        dense
      />
      <h4>{{ $t('entry.staff') }}</h4>
      <div class="q-my-lg">
        <span class="text-h5">{{ $t('entry.writer') }}</span>
        <br />
        <q-chip
          :label="writer"
          v-for="writer in entry?.writer"
          :key="writer"
          color="primary"
          text-color="secondary"
          :ripple="false"
          size="lg"
        />
      </div>
      <div class="q-my-lg">
        <span class="text-h5">{{ $t('entry.director') }}</span>
        <br />
        <q-chip
          :label="director"
          v-for="director in entry?.director"
          :key="director"
          color="primary"
          text-color="secondary"
          :ripple="false"
          size="lg"
        />
      </div>
      <div class="q-my-lg">
        <span class="text-h5">{{ $t('entry.actors') }}</span>
        <br />
        <q-chip
          :label="actor"
          v-for="actor in entry?.actors"
          :key="actor"
          color="primary"
          text-color="secondary"
          :ripple="false"
          size="lg"
        />
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
