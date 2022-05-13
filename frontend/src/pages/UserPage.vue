<template>
  <q-page class="fit column justify-start items-center content-center">
    <h2 class="text-center">Account overview</h2>
    <AccountOverview :id="props.id" />
  </q-page>
</template>

<script setup lang="ts">
import AccountOverview from '../components/AccountOverview.vue';

export type Props = {
  id: string;
};

const props = defineProps<Props>();
</script>

<style lang="scss" scoped>
h2 {
  color: $accent;
}
</style>
