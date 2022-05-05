<template>
  <q-page class="fit column justify-start items-center content-center">
    <h1 class="text-center">Account overview</h1>
    <AccountOverview :id="props.id" />
  </q-page>
</template>

<script setup lang="ts">
import AccountOverview from '../components/AccountOverview.vue';
const props = defineProps({
  id: String,
});
</script>

<style lang="scss" scoped>
h1 {
  color: $accent;
}
</style>
