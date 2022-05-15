<template>
  <img
    :src="props.posterUrl"
    alt="poster"
    width="250"
    height="300"
    v-if="props.posterUrl !== undefined && props.posterUrl !== 'N/A'"
  />
  <img
    src="~assets/document-missing.svg"
    alt="poster"
    width="250"
    height="300"
    v-else
  />
</template>

<script setup lang="ts">
export type Props = {
  posterUrl?: string;
};
const props = defineProps<Props>();
</script>
