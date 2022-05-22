<template>
  <div
    v-if="loggedIn && props.authorId == userId"
    class="q-my-xl q-pa-md bg-accent rounded-borders"
  >
    <OpinionComponent :id="props.id" />
  </div>
  <OpinionComponent v-else :id="props.id" class="q-my-xl" />
</template>
<script setup lang="ts">
import OpinionComponent from './OpinionComponent.vue';

import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/auth.store';

export type Props = {
  id: string;
  authorId: string | null;
};

const props = defineProps<Props>();

const authStore = useAuthStore();

const { userId, loggedIn } = storeToRefs(authStore);
</script>
