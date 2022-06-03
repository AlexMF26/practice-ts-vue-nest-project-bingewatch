<template>
  <q-header elevated class="bg-primary text-secondary">
    <q-toolbar>
      <q-toolbar-title
        shrink
        @click="$router.push('/')"
        style="cursor: pointer"
      >
        <q-avatar>
          <img src="~assets/logo.svg" />
        </q-avatar>
        Bingewatch
      </q-toolbar-title>
      <q-space />
      <LanguageSwitcher class="on-left gt-xs" />
      <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
    </q-toolbar>
  </q-header>
  <q-drawer v-model="rightDrawerOpen" side="right" elevated class="on-right">
    <q-list padding>
      <q-item to="/" exact>
        <q-item-section avatar>
          <q-icon color="accent" name="house" />
        </q-item-section>
        <q-item-section>{{ $t('topbar.home') }}</q-item-section>
      </q-item>

      <q-item v-if="loggedIn" :to="`/watchlist/${userId}`" exact>
        <q-item-section avatar>
          <q-icon color="accent" name="view_list" />
        </q-item-section>
        <q-item-section>{{ $t('topbar.myWatchlist') }}</q-item-section>
      </q-item>
      <q-item v-if="loggedIn" :to="`/user/${userId}`" exact>
        <q-item-section avatar>
          <q-icon color="accent" name="person_outline" />
        </q-item-section>
        <q-item-section>{{ $t('topbar.accountSettings') }}</q-item-section>
      </q-item>
      <q-item v-if="loggedIn" clickable @click="logout()">
        <q-item-section avatar>
          <q-icon color="accent" name="logout" />
        </q-item-section>
        <q-item-section>{{ $t('topbar.logout') }}</q-item-section>
      </q-item>
      <q-item to="/login" exact v-if="!loggedIn">
        <q-item-section avatar>
          <q-icon color="accent" name="login" />
        </q-item-section>
        <q-item-section>{{ $t('topbar.login') }}</q-item-section>
      </q-item>
      <q-item to="/register" exact v-if="!loggedIn">
        <q-item-section avatar>
          <q-icon color="accent" name="person_add" />
        </q-item-section>
        <q-item-section>{{ $t('topbar.register') }}</q-item-section>
      </q-item>
      <q-item :href="apiSwagger" exact>
        <q-item-section avatar>
          <q-icon color="accent" name="api" />
        </q-item-section>
        <q-item-section>API</q-item-section>
      </q-item>
      <q-item
        ><q-item-section>
          <LanguageSwitcher class="on-left xs" /> </q-item-section
      ></q-item>
    </q-list>
  </q-drawer>
</template>

<script setup lang="ts">
import LanguageSwitcher from './LanguageSwitcher.vue';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
const apiBase = import.meta.env.VITE_API;

const apiSwagger = `${apiBase}/info/`;

const store = useAuthStore();
const route = useRoute();

const { loggedIn, userId } = storeToRefs(store);
const rightDrawerOpen = ref(false);

const { logout } = store;

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}

watch(route, () => {
  rightDrawerOpen.value = false;
});
</script>

<style scoped lang="scss">
.q-toolbar__title {
  color: $accent;
}
</style>
