<template>
  <div class="full-width row items-center content-center">
    <EntryWatchUnwatchButton />
    <EntryProgress v-if="userData !== null" />
  </div>
  <EntryRating class="q-mt-lg" v-if="userData !== null" />
</template>

<script setup lang="ts">
import EntryWatchUnwatchButton from './EntryWatchUnwatchButton.vue';
import EntryProgress from './EntryProgress.vue';
import EntryRating from './EntryRating.vue';

import { storeToRefs } from 'pinia';
import { useEntriesStore } from '../stores/entries.store';

const entriesStore = useEntriesStore();

const { userData } = storeToRefs(entriesStore);
</script>
