<template>
  <div v-for="value in values" :key="value.description">
    <q-icon :name="value.icon" />
    <b class="q-mr-md">{{ value.description }}:</b>{{ value.data }}
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useUserStore } from '../stores/user.store';

const store = useUserStore();
const { userName, email } = storeToRefs(store);
const values = ref([
  {
    icon: 'person',
    description: 'Name',
    data: userName.value,
  },
  {
    icon: 'email',
    description: 'Email',
    data: email.value,
  },
]);
</script>

<style lang="scss" scoped>
.q-icon {
  margin-right: 0.5rem;
}
.q-icon,
b {
  color: $primary;
}
* {
  font-size: large;
}
</style>
