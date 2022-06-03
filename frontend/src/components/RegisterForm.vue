<template>
  <div>
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
      :autofocus="true"
    >
      <q-input
        filled
        v-model="name"
        :label="$t('auth.yourName')"
        type="email"
        :rules="[(val) => isInvalidName(val) || $t('auth.invalidName')]"
      >
        <template v-slot:prepend>
          <q-icon name="person" />
        </template>
      </q-input>

      <q-input
        filled
        v-model="email"
        :label="$t('auth.yourEmail')"
        type="email"
        :rules="[(val) => isInvalidEmail(val) || $t('auth.invalidEmail')]"
      >
        <template v-slot:prepend>
          <q-icon name="email" />
        </template>
      </q-input>

      <q-input
        filled
        v-model="password"
        :label="$t('auth.yourPassword')"
        type="password"
        :rules="[(val) => isInvalidPassword(val) || $t('auth.invalidPassword')]"
      >
        <template v-slot:prepend>
          <q-icon name="lock" />
        </template>
      </q-input>

      <div class="row items-center justify-evenly buttons-row">
        <q-btn
          :label="$t('auth.submit')"
          type="submit"
          color="primary"
          text-color="accent"
          :disable="invalidEmail || invalidPassword || invalidName"
        />
        <q-btn
          :label="$t('auth.reset')"
          type="reset"
          color="accent"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'quasar';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { useUsersStore } from '../stores/users.store';

const email = ref('');
const password = ref('');
const name = ref('');
const invalidEmail = ref(true);
const invalidPassword = ref(true);
const invalidName = ref(true);
const authStore = useAuthStore();
const userStore = useUsersStore();
const router = useRouter();

function onReset() {
  email.value = '';
  password.value = '';
  invalidEmail.value = true;
  invalidPassword.value = true;
}

const onSubmit = debounce(
  async function () {
    const user = await userStore.register({
      email: email.value,
      password: password.value,
      name: name.value,
    });
    if (user) {
      authStore.login({ email: user.email, password: password.value });
      router.push('/');
    }
  },
  500,
  true
);

function isInvalidEmail(val: string) {
  const emailPattern = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (emailPattern.test(val)) {
    invalidEmail.value = false;
    return true;
  }
  invalidEmail.value = true;
  return false;
}

function isInvalidName(val: string) {
  const namePattern = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*.?$/;
  if (namePattern.test(val)) {
    invalidName.value = false;
    return true;
  }
  invalidName.value = true;
  return false;
}

const { t } = useI18n({ useScope: 'global' });

function isInvalidPassword(val: string) {
  if (/[\s]/.test(val)) {
    invalidPassword.value = true;
    return t('auth.passwordSpace');
  }
  if (!/(?=.{8,})/.test(val)) {
    invalidPassword.value = true;
    return t('auth.passwordLength');
  }
  if (!/(?=.*[a-z])/.test(val)) {
    invalidPassword.value = true;
    return t('auth.passwordLowercase');
  }
  if (!/(?=.*[A-Z])/.test(val)) {
    invalidPassword.value = true;
    return t('auth.passwordUppercase');
  }
  if (!/(?=.*\d)/.test(val)) {
    invalidPassword.value = true;
    return t('auth.passwordDigit');
  }
  if (!/(?=.*[!@#$%^&*])/.test(val)) {
    invalidPassword.value = true;
    return t('auth.passwordSpecial');
  }
  invalidPassword.value = false;
  return true;
}
</script>

<style lang="scss" scoped>
.q-input,
.buttons-row {
  min-width: 40vw;
  max-width: 90vw;
}
</style>
