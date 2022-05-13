<template>
  <q-page> <WatchlistComponent :id="props.id" /></q-page>
</template>

<script setup lang="ts">
import WatchlistComponent from '../components/WatchlistComponent.vue';

export type Props = {
  id: string;
};

const props = defineProps<Props>();
</script>
