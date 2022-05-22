<template>
  <q-page class="column justify-center items-center content-center">
    <h4 class="q-my-xl" v-if="opinions.length === 0">No replies...</h4>
    <NewReply :id="props.id" class="q-my-xl" v-if="loggedIn" />
    <ReplyComponent
      v-for="opinion in opinions"
      :key="opinion.id"
      class="q-my-xl"
      :id="opinion.id"
      :authorId="opinion.authorId"
    ></ReplyComponent>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import NewReply from '../components/NewReply.vue';
import ReplyComponent from './ReplyComponent.vue';
import { useAuthStore } from '../stores/auth.store';
import { useOpinionsStore } from '../stores/opinions.stores';
export type Props = {
  id: string;
};

const props = defineProps<Props>();

const authStore = useAuthStore();

const opinionsStore = useOpinionsStore();

const { opinions } = storeToRefs(opinionsStore);

const { loggedIn } = storeToRefs(authStore);
</script>

<style lang="scss" scoped>
h4 {
  color: $primary;
}
</style>
