<template>
  <q-page> {{ props.id }} </q-page>
</template>

<script setup lang="ts">
export type Props = {
  id: string;
};

const props = defineProps<Props>();
</script>
