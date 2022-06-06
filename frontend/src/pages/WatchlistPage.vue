<template>
  <q-page>
    <div v-if="ready">
      <h2 class="text-center">
        {{ $t('watchlist.header', { username: username }) }}
      </h2>
      <q-btn
        :label="$t('watchlist.statistics')"
        color="accent"
        @click="stats = true"
        style="display: block; margin-inline: auto"
      />
      <q-dialog v-model="stats">
        <q-card>
          <q-card-section>
            <WatchlistStatistics />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              :label="$t('watchlist.close')"
              color="accent"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <WatchlistComponent :isOwner="isOwner" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import WatchlistComponent from '../components/WatchlistComponent.vue';
import WatchlistStatistics from '../components/WatchlistStatistics.vue';

import { useWatchlistStore } from '../stores/watchlist.store';
import { computed, onBeforeMount, ref } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { storeToRefs } from 'pinia';
import { useUsersStore } from '../stores/users.store';

export type Props = {
  id: string;
};

const props = defineProps<Props>();

const ready = ref(false);

const authStore = useAuthStore();

const { userId } = storeToRefs(authStore);

const isOwner = computed(() => {
  return userId.value === props.id;
});

const username = ref('');
const stats = ref(false);

onBeforeMount(async () => {
  const watchlistStore = useWatchlistStore();
  await watchlistStore.getWatchlist(props.id);
  const userStore = useUsersStore();
  const user = await userStore.getUser(props.id);
  username.value = user.name;
  ready.value = true;
});
</script>

<style lang="scss" scoped>
h2 {
  color: $accent;
}
</style>
