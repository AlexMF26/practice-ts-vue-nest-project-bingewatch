<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-select
        use-input
        :model-value="input"
        input-debounce="500"
        :options="options"
        option-value="imdbId"
        option-label="title"
        @input-value="setModel"
        @update:model-value="onSelect"
        @keyup.enter="onEnter"
        @filter="loadOptions"
        @clear="onClear"
        clearable
        hide-dropdown-icon
        hide-selected
        fill-input
        filled
        style="width: 80vw"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useEntriesStore } from '../stores/entries.store';
import { EntrySearchResult } from '../types/api/interface';

const router = useRouter();
const store = useEntriesStore();
const input = ref<string>('');
const options = ref<EntrySearchResult[]>([]);

function setModel(value: string) {
  input.value = value;
}

function onEnter() {
  if (input.value !== '') {
    const result = options.value.find((option) => option.title === input.value);
    if (result) {
      goToEntry(result.imdbId);
    } else if (options.value.length > 0) {
      goToEntry(options.value[0].imdbId);
    }
  }
}

function onSelect(val: EntrySearchResult) {
  if (val) {
    goToEntry(val.imdbId);
  }
}

function onClear() {
  input.value = '';
}

async function loadOptions(
  val: string,
  update: (arg0: () => EntrySearchResult[]) => void,
  abort: () => void
) {
  if (val.length < 3) {
    abort();
    return;
  }
  const results = await store.query(val);
  update(() => (options.value = results));
}

function goToEntry(imdbId: string) {
  router.push('/entry/' + imdbId);
}
</script>
