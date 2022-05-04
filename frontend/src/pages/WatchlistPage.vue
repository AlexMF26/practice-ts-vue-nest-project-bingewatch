<template>
  <q-page class="row items-center justify-evenly"> {{ props }} </q-page>
</template>

<script setup>
const props = defineProps({
  id: String,
});
</script>
