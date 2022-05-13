<template>
  <q-page class="full-width column items-center content-center">
    <h2 class="text-center" style="margin-top: 20vh; margin-bottom: 20vh">
      Login
    </h2>
    <LoginForm />
  </q-page>
</template>

<script setup lang="ts">
import LoginForm from '../components/LoginForm.vue';
</script>

<style lang="scss" scoped>
h2 {
  color: $accent;
}
</style>
