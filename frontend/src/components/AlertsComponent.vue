<template>
  <q-card
    v-for="(alert, index) in alerts"
    :key="alert.id"
    class="alert-card shadow-2"
    v-bind:style="{ 'margin-top': 4 + index * 10 + 'vh' }"
  >
    <div class="q-pa-md q-pr-xs row">
      <q-icon
        v-if="alert.type == 'success'"
        name="done_outline"
        color="positive"
        size="md"
        left
      />
      <q-icon
        v-if="alert.type == 'error'"
        name="priority_high"
        color="negative"
        size="md"
        left
      />
      <div>{{ alert.message }}</div>
      <q-icon
        name="close"
        @click="removeAlert(alert.id)"
        class="absolute-top-right"
        size="md"
        right
        style="cursor: pointer"
      />
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { useAlertsStore } from '../stores/alerts.store';
import { storeToRefs } from 'pinia';

const store = useAlertsStore();
const { alerts } = storeToRefs(store);

const { removeAlert } = store;
</script>

<style lang="scss" scoped>
.alert-card {
  z-index: 99;
  position: absolute;
  right: 0;
  margin-right: 5vw;
  min-width: 30vw;
  max-width: 95vw;
}
</style>
