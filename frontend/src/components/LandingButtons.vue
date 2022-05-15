<template>
  <div class="row items-center justify-evenly q-py-xl" v-if="!loggedIn">
    <q-btn
      @click="$router.push('/login')"
      color="accent"
      label="Login"
      class="col-5"
      icon-right="login"
    ></q-btn>
    <span class="text-h6">OR</span>
    <q-btn
      icon="person_add"
      label="Register"
      @click="$router.push('/register')"
      color="accent"
      text-color="secondary"
      class="col-5"
    ></q-btn>
  </div>
  <div class="row items-center justify-evenly q-pt-xl" v-if="loggedIn">
    <q-btn
      icon="list"
      label="Your watchlist"
      @click="$router.push('/watchlist/' + userId)"
      color="accent"
      text-color="secondary"
      class="col-7"
    ></q-btn>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/auth.store';

const { userId, loggedIn } = storeToRefs(useAuthStore());
</script>
