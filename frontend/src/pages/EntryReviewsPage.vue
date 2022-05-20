<template>
  <q-page> <ReviewsComponent :id="props.id" v-if="ready" /> </q-page>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import ReviewsComponent from '../components/ReviewsComponent.vue';
import { useOpinionsStore } from '../stores/opinions.stores';

export type Props = {
  id: string;
};

const props = defineProps<Props>();

const ready = ref(false);

onBeforeMount(async () => {
  const opinionsStore = useOpinionsStore();
  await opinionsStore.getReviews(props.id);
  ready.value = true;
});
</script>
