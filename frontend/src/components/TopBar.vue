<template>
  <q-header elevated class="bg-primary text-secondary">
    <q-toolbar>
      <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      <q-space />
      <q-toolbar-title
        shrink
        @click="$router.push({ path: '/' })"
        style="cursor: pointer"
      >
        Bingewatch
        <q-avatar>
          <img src="~assets/logo.svg" />
        </q-avatar>
      </q-toolbar-title>
    </q-toolbar>
  </q-header>
  <q-drawer v-model="rightDrawerOpen" side="left" elevated>
    <q-list padding>
      <q-item to="/" exact>
        <q-item-section avatar>
          <q-icon color="accent" name="house" />
        </q-item-section>
        <q-item-section>Home</q-item-section>
      </q-item>

      <q-item v-if="loggedIn" :to="`/watchlist/${userId}`" exact>
        <q-item-section avatar>
          <q-icon color="accent" name="view_list" />
        </q-item-section>
        <q-item-section>My watchlist</q-item-section>
      </q-item>
      <q-item v-if="loggedIn" :to="`/user/${userId}`" exact>
        <q-item-section avatar>
          <q-icon color="accent" name="person_outline" />
        </q-item-section>
        <q-item-section>Account settings</q-item-section>
      </q-item>
      <q-item v-if="loggedIn" clickable @click="logout()">
        <q-item-section avatar>
          <q-icon color="accent" name="logout" />
        </q-item-section>
        <q-item-section>Logout</q-item-section>
      </q-item>
      <q-item to="/login" exact v-if="!loggedIn">
        <q-item-section avatar>
          <q-icon color="accent" name="login" />
        </q-item-section>
        <q-item-section>Login</q-item-section>
      </q-item>
      <q-item to="/register" exact v-if="!loggedIn">
        <q-item-section avatar>
          <q-icon color="accent" name="person_add" />
        </q-item-section>
        <q-item-section>Register</q-item-section>
      </q-item>
      <q-item href="/api/info/" exact>
        <q-item-section avatar>
          <q-icon color="accent" name="api" />
        </q-item-section>
        <q-item-section>API</q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useUserStore } from '../stores/user.store';

const store = useUserStore();
const { loggedIn, userId } = storeToRefs(store);
const rightDrawerOpen = ref(false);

const { logout } = store;

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}
</script>

<style scoped lang="scss">
.q-toolbar__title {
  color: $accent;
}
</style>
