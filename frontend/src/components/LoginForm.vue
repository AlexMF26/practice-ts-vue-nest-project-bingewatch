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
        v-model="email"
        label="Your email *"
        type="email"
        :rules="[(val) => isInvalidEmail(val) || 'Please enter a valid email']"
      >
        <template v-slot:prepend>
          <q-icon name="email" />
        </template>
      </q-input>

      <q-input
        filled
        v-model="password"
        label="Your password *"
        type="password"
        :rules="[
          (val) => isInvalidPassword(val) || 'Please enter a valid password',
        ]"
      >
        <template v-slot:prepend>
          <q-icon name="lock" />
        </template>
      </q-input>

      <div class="row items-center justify-evenly buttons-row">
        <q-btn
          label="Submit"
          type="submit"
          color="primary"
          text-color="accent"
          :disable="invalidEmail || invalidPassword"
        />
        <q-btn label="Reset" type="reset" color="accent" flat class="q-ml-sm" />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'quasar';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const email = ref('');
const password = ref('');
const invalidEmail = ref(true);
const invalidPassword = ref(true);
const authStore = useAuthStore();
const router = useRouter();

function onReset() {
  email.value = '';
  password.value = '';
  invalidEmail.value = true;
  invalidPassword.value = true;
}

const onSubmit = debounce(
  async function () {
    await authStore.login({
      email: email.value,
      password: password.value,
    });
    router.push('/');
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

function isInvalidPassword(val: string) {
  if (/[\s]/.test(val)) {
    invalidPassword.value = true;
    return 'Password must not contain spaces';
  }
  if (!/(?=.{8,})/.test(val)) {
    invalidPassword.value = true;
    return 'Password must be at least 8 characters long';
  }
  if (!/(?=.*[a-z])/.test(val)) {
    invalidPassword.value = true;
    return 'Password must contain at least one lowercase letter';
  }
  if (!/(?=.*[A-Z])/.test(val)) {
    invalidPassword.value = true;
    return 'Password must contain at least one uppercase letter';
  }
  if (!/(?=.*\d)/.test(val)) {
    invalidPassword.value = true;
    return 'Password must contain at least digit number';
  }
  if (!/(?=.*[!@#$%^&*])/.test(val)) {
    invalidPassword.value = true;
    return 'Password must contain at least one special character';
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
