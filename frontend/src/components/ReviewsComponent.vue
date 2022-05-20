<template>
  <div class="column justify-center items-center content-center">
    <NewOpinion v-if="loggedIn && !reviewed" class="q-my-xl" :id="props.id" />
    <div v-else class="q-my-xl">{{ loggedIn && !reviewed }}</div>
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

import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/auth.store';
import { useOpinionsStore } from '../stores/opinions.stores';

export type Props = {
  id: string;
};

const props = defineProps<Props>();

const opinionsStore = useOpinionsStore();

const authStore = useAuthStore();

const { opinions } = storeToRefs(opinionsStore);

const { userId, loggedIn } = storeToRefs(authStore);

const reviewed = computed(() => {
  return opinions.value.some((opinion) => opinion.authorId === userId.value);
});
</script>
