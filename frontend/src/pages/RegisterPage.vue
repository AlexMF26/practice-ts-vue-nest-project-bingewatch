<template>
  <q-page class="row justify-evenly">
    <h1 class="col-12 q-mt-xl text-center">Register</h1>
    <RegisterForm />
  </q-page>
</template>

<script setup lang="ts">
import RegisterForm from '../components/RegisterForm.vue';
</script>

<style lang="scss" scoped>
h1 {
  color: $accent;
}
</style>
