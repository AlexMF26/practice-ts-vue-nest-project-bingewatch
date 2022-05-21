<template>
  <div class="column justify-center items-center content-center" v-if="ready">
    <NewOpinion v-if="canReview" class="q-my-xl" :id="props.id" />
    <div v-else-if="hasReview" class="q-my-xl">My Review</div>
    <div
      v-for="opinion in opinions"
      :key="opinion.id"
      :id="opinion.id"
      class="q-my-xl"
    >
      review {{ opinion.id }}
    </div>
  </div>
</template>

<script setup lang="ts">
import NewOpinion from './NewOpinion.vue';

import { computed, onBeforeMount, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/auth.store';
import { useOpinionsStore } from '../stores/opinions.stores';
import { useWatchlistStore } from '../stores/watchlist.store';
import { WatchlistItemEntity } from '../types/api/interface';

export type Props = {
  id: string;
};

const props = defineProps<Props>();

const opinionsStore = useOpinionsStore();

const authStore = useAuthStore();

const watchlistStore = useWatchlistStore();

const { opinions } = storeToRefs(opinionsStore);

const { userId, loggedIn } = storeToRefs(authStore);

const reviewed = computed(() => {
  return opinions.value.some((opinion) => opinion.authorId === userId.value);
});

const watchlistItem = ref<WatchlistItemEntity | ''>('');

const ready = ref(false);

onBeforeMount(async () => {
  watchlistItem.value = await watchlistStore.getWatchListItem(
    userId.value,
    props.id
  );
  ready.value = true;
});

const canReview = computed(() => {
  return loggedIn.value && watchlistItem.value != '' && !reviewed.value;
});

const hasReview = computed(() => {
  return loggedIn.value && watchlistItem.value != '' && reviewed.value;
});
</script>
