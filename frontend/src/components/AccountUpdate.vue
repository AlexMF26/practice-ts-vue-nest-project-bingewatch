/* eslint-disable @typescript-eslint/no-unused-vars */
<template>
  <q-tabs
    v-model="activeTab"
    inline-label
    class="bg-primary text-secondary shadow-2"
    active-color="accent"
  >
    <q-tab name="name" icon="person" label="Name" />
    <q-tab name="email" icon="email" label="Email" />
    <q-tab name="password" icon="lock" label="Password" />
  </q-tabs>
  <q-separator />
  <q-card-section>
    <q-tab-panels v-model="activeTab" animated>
      <q-tab-panel name="name">
        <q-input
          filled
          v-model="name"
          label="Your name *"
          type="text"
          :rules="[(val) => isInvalidName(val) || 'Please enter a valid name']"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>
      </q-tab-panel>

      <q-tab-panel name="email">
        <q-input
          filled
          v-model="email"
          label="Your email *"
          type="email"
          :rules="[
            (val) => isInvalidEmail(val) || 'Please enter a valid email',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="email" />
          </template>
        </q-input>
      </q-tab-panel>

      <q-tab-panel name="password">
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
      </q-tab-panel>
    </q-tab-panels>
    <div class="row items-center justify-evenly buttons-row">
      <q-btn
        label="Submit"
        color="accent"
        text-color="secondary"
        :disabled="disableSubmit"
        @click="submit()"
      />
      <q-btn
        label="Reset"
        color="accent"
        flat
        class="q-ml-sm"
        @click="reset()"
      />
    </div>
  </q-card-section>
</template>
<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { ref } from 'vue';
import { useUserStore } from '../stores/user.store';

const props = defineProps({
  id: String,
});

const store = useUserStore();
const activeTab = ref<'name' | 'email' | 'password'>('name');
const name = ref('');
const email = ref('');
const password = ref('');
const invalidEmail = ref(true);
const invalidPassword = ref(true);
const invalidName = ref(true);
const disableSubmit = computed(() => {
  if (activeTab.value === 'name') {
    return invalidName.value;
  }
  if (activeTab.value === 'email') {
    return invalidEmail.value;
  }
  if (activeTab.value === 'password') {
    return invalidPassword.value;
  }
});

function reset() {
  if (activeTab.value === 'name') {
    name.value = '';
  } else if (activeTab.value === 'email') {
    email.value = '';
  } else if (activeTab.value === 'password') {
    password.value = '';
  }
}

async function submit() {
  try {
    if (activeTab.value === 'name') {
      await updateName();
    } else if (activeTab.value === 'email') {
      await updateEmail();
    } else if (activeTab.value === 'password') {
      await updatePassword();
    }
    await store.getDetails();
  } catch (error) {
    console.error(error);
  }
}

async function updateName() {
  if (props.id !== undefined) {
    return await store.update(
      {
        name: name.value,
      },
      props.id
    );
  }
}

async function updateEmail() {
  if (props.id !== undefined) {
    return await store.update(
      {
        email: email.value,
      },
      props.id
    );
  }
}

async function updatePassword() {
  if (props.id !== undefined) {
    return await store.update(
      {
        password: password.value,
      },
      props.id
    );
  }
}

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
