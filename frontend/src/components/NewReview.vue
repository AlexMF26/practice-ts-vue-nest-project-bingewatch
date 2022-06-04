<template>
  <q-card bordered>
    <q-card-section>
      <q-tabs
        v-model="activeTab"
        inline-label
        active-color="accent"
        dense
        class="bg-secondary shadow-2"
      >
        <q-tab name="input" icon="edit_note" :label="$t('opinions.input')" />
        <q-tab name="preview" icon="preview" :label="$t('opinions.preview')" />
      </q-tabs>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel
          name="input"
          class="column justify-center items-center content-center"
        >
          <textarea
            v-model="markdown"
            class="bg-secondary shadow-2"
            :placeholder="$t('opinions.placeholder')"
          ></textarea>
        </q-tab-panel>

        <q-tab-panel name="preview">
          <div
            v-html="markdownToHtml"
            class="markdown bg-secondary shadow-2 q-pa-md"
          ></div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
    <q-separator />

    <q-card-actions vertical align="right">
      <q-btn
        color="primary"
        text-color="secondary"
        :disable="disabled"
        @click="postReview"
      >
        {{ $t('opinions.post') }}
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { marked } from 'marked';
import { useOpinionsStore } from '../stores/opinions.stores';
import { debounce } from 'quasar';
import DOMPurify from 'dompurify';

export type Props = {
  id: string;
};

const props = defineProps<Props>();

const markdown = ref('');
const markdownToHtml = computed(() =>
  DOMPurify.sanitize(marked(markdown.value))
);
const activeTab = ref<'input' | 'preview'>('input');

const disabled = computed(() => {
  return markdown.value.trim().length === 0;
});

const opinionsStore = useOpinionsStore();

const postReview = debounce(
  async function () {
    await opinionsStore.addReview({
      text: markdown.value,
      entryId: props.id,
    });
    markdown.value = '';
  },
  1000,
  true
);
</script>

<style lang="scss" scoped>
.q-card {
  min-width: 40vw;
  max-width: 90vw;
  max-height: 50vh;
  overflow: auto;
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
