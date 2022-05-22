<template>
  <q-page> <RepliesComponents :id="props.id" v-if="ready" /> </q-page>
</template>

<script setup lang="ts">
import { onBeforeMount, onUpdated, ref } from 'vue';
import RepliesComponents from '../components/RepliesComponents.vue';
import { useOpinionsStore } from '../stores/opinions.stores';
export type Props = {
  id: string;
};

const props = defineProps<Props>();

const ready = ref(false);

onBeforeMount(async () => {
  const opinionsStore = useOpinionsStore();
  await opinionsStore.getReplies(props.id);
  ready.value = true;
});

onUpdated(async () => {
  ready.value = false;
  const opinionsStore = useOpinionsStore();
  await opinionsStore.getReplies(props.id);
  ready.value = true;
});
</script>
