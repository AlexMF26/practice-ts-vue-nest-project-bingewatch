<template>
  <q-tabs
    v-model="activeTab"
    inline-label
    class="bg-primary text-secondary shadow-2"
    active-color="accent"
  >
    <q-tab name="name" icon="person" :label="$t('auth.name')" />
    <q-tab name="email" icon="email" :label="$t('auth.email')" />
    <q-tab name="password" icon="lock" :label="$t('auth.password')" />
  </q-tabs>
  <q-separator />
  <q-card-section>
    <q-tab-panels v-model="activeTab" animated>
      <q-tab-panel name="name">
        <q-input
          filled
          v-model="name"
          :label="$t('auth.yourName')"
          type="text"
          :rules="[(val) => isInvalidName(val) || $t('auth.invalidName')]"
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
          :label="$t('auth.yourEmail')"
          type="email"
          :rules="[(val) => isInvalidEmail(val) || $t('auth.invalidEmail')]"
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
          :label="$t('auth.yourPassword')"
          type="password"
          :rules="[
            (val) => isInvalidPassword(val) || $t('auth.invalidPassword'),
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
        :label="$t('auth.submit')"
        color="accent"
        text-color="secondary"
        :disable="disableSubmit"
        @click="submit()"
      />
      <q-btn
        :label="$t('auth.reset')"
        color="accent"
        flat
        class="q-ml-sm"
        @click="reset()"
      />
    </div>
  </q-card-section>
</template>

<script setup lang="ts">
import { debounce } from 'quasar';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { useUsersStore } from '../stores/users.store';

export type Props = {
  id: string;
};

const props = defineProps<Props>();
const emit = defineEmits<{ (e: 'updateUserData'): void }>();

const userStore = useUsersStore();
const authStore = useAuthStore();
const router = useRouter();
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
  return false;
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

const submit = debounce(
  async function () {
    try {
      if (activeTab.value === 'name') {
        await updateName();
      } else if (activeTab.value === 'email') {
        await updateEmail();
      } else if (activeTab.value === 'password') {
        await updatePassword();
      }
      if (authStore.userId === props.id) {
        await authStore.getDetails();
      }
      emit('updateUserData');
    } catch (error) {
      if (error instanceof Error && error.message.includes('401')) {
        router.push('/unauthorized');
      } else if (error instanceof Error && error.message.includes('404')) {
        router.push('/not-found');
      }
    }
  },
  500,
  true
);

async function updateName() {
  return await userStore.update(
    {
      name: name.value,
    },
    props.id
  );
}

async function updateEmail() {
  return await userStore.update(
    {
      email: email.value,
    },
    props.id
  );
}

async function updatePassword() {
  return await userStore.update(
    {
      password: password.value,
    },
    props.id
  );
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
