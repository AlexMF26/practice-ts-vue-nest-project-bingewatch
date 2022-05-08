<template>
  <q-page> <WatchlistComponent :id="props.id" /></q-page>
</template>

<script setup>
import WatchlistComponent from '../components/WatchlistComponent.vue';

const props = defineProps({
  id: String,
});
</script>
