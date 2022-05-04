<template>
  <q-page class="row items-center justify-evenly">
    <q-btn class="col-span-1" color="primary" @click="test()" />
  </q-page>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth.store';

const authStore = useAuthStore();
const test = () => {
  authStore.login({
    email: 'Ion.Popescu@google.com',
    password: 'P@ssworuud123',
  });
};
</script>
