<template>
  <q-select
    v-model="locale"
    :label="$t('lang.select')"
    :options="langs"
    :option-label="getLabel"
    :option-disable="disable"
    filled
    dense
    hide-bottom-space
    bg-color="secondary"
    color="accent"
    style="min-width: 10em"
  />
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { locale, t } = useI18n({ useScope: 'global' });

const langs = ['ro', 'en'];

function getLabel(option: 'ro' | 'en') {
  return t(`lang.${option}`);
}

function disable(option: 'ro' | 'en') {
  return option === locale.value;
}
</script>
