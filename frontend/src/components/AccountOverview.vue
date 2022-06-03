<template>
  <q-card style="min-width: 60vw; max-width: 95vw">
    <q-card-section>
      <q-tabs
        v-model="activeTab"
        inline-label
        class="bg-primary text-secondary shadow-2"
        active-color="accent"
      >
        <q-tab :label="$t('account.details')" icon="info" name="details" />
        <q-tab :label="$t('account.update')" icon="update" name="update" />
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

import { onBeforeMount, ref } from 'vue';
import { useUsersStore } from '../stores/users.store';
import { useRouter } from 'vue-router';

export type Props = {
  id: string;
};

const props = defineProps<Props>();

const activeTab = ref<'details' | 'update'>('details');
const store = useUsersStore();
const router = useRouter();
const infos = ref<dataEntry[]>([]);

async function fetchData() {
  try {
    const user = await store.getUser(props.id);
    infos.value = [
      {
        description: 'name',
        data: user.name,
        icon: 'person',
      },
      {
        description: 'email',
        data: user.email,
        icon: 'email',
      },
      {
        description: 'role',
        data: user.role,
        icon: 'workspace_premium',
      },
    ];
  } catch (error) {
    if (error instanceof Error && error.message.includes('401')) {
      router.push('/unauthorized');
    } else if (error instanceof Error && error.message.includes('404')) {
      router.push('/not-found');
    } else {
      router.push('/unknown-error');
    }
  }
}

onBeforeMount(fetchData);
</script>
