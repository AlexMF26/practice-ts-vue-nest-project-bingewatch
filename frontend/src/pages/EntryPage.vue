<template>
  <q-page>
    <EntryComponent v-if="ready" />
  </q-page>
</template>

<script setup lang="ts">
import EntryComponent from '../components/EntryComponent.vue';

import { onBeforeMount, ref } from 'vue';
import { useEntriesStore } from '../stores/entries.store';

export type Props = {
  id: string;
};

const props = defineProps<Props>();

const ready = ref(false);

onBeforeMount(async () => {
  const entriesStore = useEntriesStore();
  await entriesStore.get(props.id);
  ready.value = true;
});
</script>
