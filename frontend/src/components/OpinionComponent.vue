<template>
  <q-card bordered>
    <q-card-actions align="around" v-if="hasFullAcces && !deleted">
      <q-btn
        color="negative"
        text-color="secondary"
        label="Delete"
        @click="deleteOpinion"
      ></q-btn>
      <q-btn
        color="positive"
        text-color="secondary"
        label="Edit"
        v-if="!isEditing"
        @click="edit"
      ></q-btn>
    </q-card-actions>
    <q-separator v-if="hasFullAcces" />

    <q-card-section v-if="isEditing">
      <q-tabs
        v-model="activeEditTab"
        inline-label
        active-color="accent"
        dense
        class="bg-secondary shadow-2"
      >
        <q-tab name="input" icon="edit_note" label="Input" />
        <q-tab name="preview" icon="preview" label="Preview" />
      </q-tabs>

      <q-tab-panels v-model="activeEditTab" animated>
        <q-tab-panel
          name="input"
          class="column justify-center items-center content-center"
        >
          <textarea
            v-model="newMarkdown"
            class="bg-secondary shadow-2"
          ></textarea>
        </q-tab-panel>

        <q-tab-panel name="preview">
          <div
            v-html="newMarkdownToHtml"
            class="markdown bg-secondary shadow-2 q-pa-md"
          ></div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
    <q-card-section v-else>
      <div
        v-html="contentHtml"
        class="markdown bg-secondary shadow-2 q-pa-md"
        v-if="!deleted"
      ></div>
      <span v-else class="deleted text-subtitle2">deleted</span></q-card-section
    >

    <q-card-actions align="around" v-if="isEditing">
      <q-btn
        color="negative"
        text-color="secondary"
        @click="isEditing = false"
        label="Cancel"
      ></q-btn>
      <q-btn
        color="positive"
        text-color="secondary"
        :disable="!canSubmit"
        label="Submit"
        @click="submit"
      ></q-btn>
    </q-card-actions>
    <q-card-actions align="around" v-else>
      <q-btn
        color="primary"
        text-color="secondary"
        v-if="hasAuthor"
        @click="$router.push('/watchlist/' + authorId)"
        label="Watchlist"
      ></q-btn>

      <q-btn
        color="accent"
        text-color="secondary"
        label="Replies"
        @click="$router.push('/opinion/' + id + '/replies')"
      ></q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { marked } from 'marked';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { useOpinionsStore } from '../stores/opinions.stores';

export type Props = {
  id: string;
};

const props = defineProps<Props>();

const opinionsStore = useOpinionsStore();

const authStore = useAuthStore();

const { opinions } = storeToRefs(opinionsStore);

const { loggedIn, userId, isAdmin } = storeToRefs(authStore);

const opinion = computed(() => {
  return opinions.value.find((o) => o.id === props.id);
});

const authorId = computed(() => {
  if (!opinion.value?.authorId) {
    return 'deleted';
  } else {
    return opinion.value.authorId;
  }
});

const content = computed(() => {
  return opinion.value?.text ?? 'deleted opinion';
});

const deleted = computed(() => {
  return opinion.value?.authorId === null && opinion.value?.text === null;
});
const contentHtml = computed(() => marked(content.value));
const newMarkdown = ref(content.value);

const newMarkdownToHtml = computed(() => marked(newMarkdown.value));

const activeEditTab = ref<'input' | 'preview'>('input');

const isEditing = ref(false);

const canSubmit = computed(
  () =>
    newMarkdown.value !== content.value && newMarkdown.value.trim().length > 0
);

const hasAuthor = computed(() => authorId.value !== 'deleted');

const hasFullAcces = computed(() => {
  if (!loggedIn.value) {
    return false;
  } else if (isAdmin.value) {
    return true;
  } else if (authorId.value === userId.value) {
    return true;
  } else {
    return false;
  }
});

async function edit() {
  newMarkdown.value = content.value;
  isEditing.value = true;
}

async function deleteOpinion() {
  if (opinion.value) {
    await opinionsStore.deleteOpinion(opinion.value.id);
  }
}

async function submit() {
  if (opinion.value) {
    await opinionsStore.changeOpionion(opinion.value.id, {
      text: newMarkdown.value,
    });
  }
  isEditing.value = false;
}
</script>

<style lang="scss" scoped>
.q-card {
  min-width: 40vw;
  max-width: 90vw;
  max-height: 50vh;
  overflow: auto;
}
.deleted {
  text-align: center;
  display: inline-block;
  width: 100%;
}
textarea {
  min-width: 30vw;
  max-width: 80vw;
  min-height: 10vh;
  max-height: 40vh;
}
.markdown {
  min-width: 30vw;
  max-width: 80vw;
  min-height: 10vh;
}
:deep(.markdown) {
  white-space: pre-wrap;
  overflow-wrap: break-word;
  word-break: break-word;
  hyphens: auto;

  blockquote {
    border-left: 0.1rem solid darkgray;
    padding-left: 1rem;
  }

  code {
    font-family: monospace;
    font-size: 0.9rem;
    background-color: #f5f5f5;
    padding: 0.1rem 0.3rem;
    border-radius: 0.2rem;
  }
}
</style>
