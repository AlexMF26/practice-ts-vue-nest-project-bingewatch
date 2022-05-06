<template>
  <q-layout view="hHh lpR lfr">
    <TopBar />
    <q-page-container>
      <AlertsComponent />
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import AlertsComponent from '../components/AlertsComponent.vue';
import TopBar from '../components/TopBar.vue';
</script>

<style lang="scss">
.q-page-container {
  background-color: $secondary;
}
</style>
