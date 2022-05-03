<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <AlertsComponent />
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import AlertsComponent from '../components/AlertsComponent.vue';
</script>
