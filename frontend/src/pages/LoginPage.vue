<template>
  <q-page class="row justify-evenly">
    <h1 class="col-12 q-mt-xl text-center">Login</h1>
    <LoginForm />
  </q-page>
</template>

<script setup lang="ts">
import LoginForm from '../components/LoginForm.vue';
</script>

<style lang="scss" scoped>
h1 {
  color: $accent;
}
</style>
