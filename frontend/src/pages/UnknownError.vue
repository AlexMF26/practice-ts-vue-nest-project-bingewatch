<template>
  <div
    class="fullscreen bg-secondary text-primary text-center q-pa-md flex flex-center"
  >
    <div>
      <div style="font-size: 10vh">{{ $t('errors.unknown') }}</div>

      <div class="text-h2" style="opacity: 0.4">
        {{ $t('errors.unknownMessage') }}
      </div>

      <q-btn
        class="q-mt-xl"
        color="primary"
        text-color="accent"
        unelevated
        to="/"
        :label="$t('errors.backToHome')"
        no-caps
      />
    </div>
  </div>
</template>
