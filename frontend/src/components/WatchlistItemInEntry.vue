<template>
  <div>
    <EntryWatchUnwatchButton />
    <EntryProgress v-if="userData !== null" class="q-mt-md" />
    <EntryRating v-if="userData !== null" class="q-mt-md" />
  </div>
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
