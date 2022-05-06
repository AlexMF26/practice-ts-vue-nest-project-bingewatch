<template>
  <q-page>
    <EntryComponent :id="props.id" />
  </q-page>
</template>

<script setup lang="ts">
import EntryComponent from '../components/EntryComponent.vue';
export type Props = {
  id: string;
};
const props = defineProps<Props>();
</script>
