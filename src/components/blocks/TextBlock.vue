<script setup>
import { shallowRef, computed } from 'vue'

import { Codemirror } from 'vue-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'

const view = shallowRef(null)

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  block: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['remove', 'update:modelValue'])

const text = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const extensions = [markdown(), oneDark]

const handleReady = (payload) => {
  view.value = payload.view
}
</script>

<template>
  <div class="d-flex">
    <v-card class="flex-grow-1 flex-shrink-0 pa-2" rounded="lg">
      <v-sheet class="overflow-hidden" rounded>
        <codemirror
          v-model="text"
          :autofocus="true"
          :indent-with-tab="true"
          :tab-size="2"
          :extensions="extensions"
          placeholder=""
          @ready="handleReady"
        ></codemirror>
      </v-sheet>
    </v-card>

    <v-btn
      icon="mdi-close"
      variant="plain"
      size="small"
      class="ml-2"
      @click="emit('remove')"
    ></v-btn>
  </div>
</template>

<style>
.outlined-sheet {
  border: 1px solid rgba(0, 0, 0, 0.5);
}
</style>
