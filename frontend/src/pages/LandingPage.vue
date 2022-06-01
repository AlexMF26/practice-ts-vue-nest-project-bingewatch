<template>
  <q-page>
    <div class="row items-center justify-evenly q-py-xl">
      <SearchBarEntry />
    </div>
    <h3 class="q-py-xl text-center">{{ $t('landingContent.motto') }}</h3>
    <LandingButtons />
  </q-page>
</template>

<script setup lang="ts">
import SearchBarEntry from '../components/SearchBarEntry.vue';
import LandingButtons from '../components/LandingButtons.vue';
</script>

<style lang="scss" scoped>
* {
  color: $primary;
}
</style>
