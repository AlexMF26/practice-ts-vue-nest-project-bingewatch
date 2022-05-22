<template>
  <div class="column justify-center items-center content-center" v-if="ready">
    <NewReview v-if="canReview" class="q-my-xl" :id="props.id" />
    <div
      v-else-if="hasReview"
      class="q-my-xl q-pa-xs bg-accent rounded-borders"
    >
      <OpinionComponent :id="reviewed?.id as string" />
    </div>
    <OpinionComponent
      v-for="opinion in otherReviews"
      :key="opinion.id"
      :id="opinion.id"
      class="q-my-xl"
    ></OpinionComponent>
  </div>
</template>

<script setup lang="ts">
import NewReview from './NewReview.vue';
import OpinionComponent from './OpinionComponent.vue';

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
  return opinions.value.find((opinion) => opinion.authorId === userId.value);
});

const watchlistItem = ref<WatchlistItemEntity | ''>('');

const ready = ref(false);

onBeforeMount(async () => {
  if (loggedIn.value) {
    watchlistItem.value = await watchlistStore.getWatchListItem(
      userId.value,
      props.id
    );
  }
  ready.value = true;
});

const canReview = computed(() => {
  return (
    loggedIn.value && watchlistItem.value != '' && reviewed.value == undefined
  );
});

const hasReview = computed(() => {
  return (
    loggedIn.value && watchlistItem.value != '' && reviewed.value != undefined
  );
});

const otherReviews = computed(() => {
  return opinions.value.filter((opinion) => opinion.id !== reviewed.value?.id);
});
</script>
