<template>
  <div
    class="fullscreen bg-secondary text-primary text-center q-pa-md flex flex-center"
  >
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.4">
        {{ $t('errors.notFoundMessage') }}
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
