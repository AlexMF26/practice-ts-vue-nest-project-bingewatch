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
          <AccountDetails :infos="infos" />
        </q-tab-panel>

        <q-tab-panel name="update">
          <AccountUpdate :id="props.id" @update-user-data="fetchData()" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import AccountDetails, { dataEntry } from '../components/AccountDetails.vue';
import AccountUpdate from '../components/AccountUpdate.vue';

import { onBeforeMount, onUpdated, ref } from 'vue';
import { useUserStore } from '../stores/user.store';
import { useRouter } from 'vue-router';

const props = defineProps<{ id: string }>();

const activeTab = ref<'details' | 'update'>('details');
const store = useUserStore();
const router = useRouter();
const infos = ref<dataEntry[]>([]);

async function fetchData() {
  try {
    const user = await store.getUser(props.id);
    infos.value = [
      {
        description: 'Username',
        data: user.name,
        icon: 'person',
      },
      {
        description: 'Email',
        data: user.email,
        icon: 'email',
      },
      {
        description: 'Role',
        data: user.role,
        icon: 'workspace_premium',
      },
    ];
  } catch (error: any) {
    if (error?.message?.toString()?.includes('401')) {
      router.push('/unauthorized');
    } else if (error?.message?.toString()?.includes('404')) {
      router.push('/not-found');
    } else {
      router.push('/unknown-error');
    }
  }
}

onBeforeMount(fetchData);
</script>
