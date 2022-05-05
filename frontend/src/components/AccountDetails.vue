<template>
  <div v-for="value in props.infos" :key="value.description">
    <q-icon :name="value.icon" />
    <b class="q-mr-md">{{ value.description }}:</b>{{ value.data }}
  </div>
</template>
<script setup lang="ts">
export type dataEntry = {
  description: string;
  data: string;
  icon: string;
};

export type Props = {
  infos: dataEntry[];
};

const props = withDefaults(defineProps<Props>(), {
  infos: () => [],
});
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
