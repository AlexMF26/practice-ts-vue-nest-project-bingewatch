<template>
  <q-card style="min-width: 40rem">
    <q-card-section>
      <q-tabs
        v-model="activeTab"
        inline-label
        class="bg-primary text-secondary shadow-2"
        active-color="accent"
      >
        <q-tab name="details" icon="info" label="Details" />
        <q-tab name="update" icon="update" label="Update" />
      </q-tabs>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel name="details">
          <AccountDetails />
        </q-tab-panel>

        <q-tab-panel name="update">
          <AccountUpdate :id="props.id" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import AccountDetails from '../components/AccountDetails.vue';
import AccountUpdate from '../components/AccountUpdate.vue';

import { ref } from 'vue';

const props = defineProps({
  id: String,
});

const activeTab = ref<'details' | 'update'>('details');
</script>
