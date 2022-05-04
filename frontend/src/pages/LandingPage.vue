<template>
  <q-page class="row items-center justify-evenly">
    <q-btn class="col-span-1" color="primary" @click="test()" />
    <q-btn class="col-span-1" color="primary" @click="test2()" />
  </q-page>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth.store';

const authStore = useAuthStore();
const test = () => {
  authStore.login({
    email: 'Ion.Popescu@google.com',
    password: 'P@ssword123',
  });
};
const test2 = () => {
  authStore.logout();
};
</script>
