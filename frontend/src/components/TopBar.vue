<template>
  <q-header elevated class="bg-primary text-secondary">
    <q-toolbar>
      <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      <q-space />
      <q-toolbar-title shrink>
        Bingewatch
        <q-avatar>
          <img src="logo.svg" />
        </q-avatar>
      </q-toolbar-title>
    </q-toolbar>
  </q-header>
  <q-drawer show-if-above v-model="rightDrawerOpen" side="left" bordered>
    <q-list dense> </q-list>
  </q-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const rightDrawerOpen = ref(false);
function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}
</script>
