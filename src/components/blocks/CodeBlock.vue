<script setup>
import { shallowRef, computed } from 'vue'

import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

import JSONResult from '@/components/results/JSONResult.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  block: {
    type: Object,
    default: () => ({})
  },
  showResult: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['execute', 'remove', 'update:modelValue'])
const view = shallowRef(null)

const loading = computed(() => props.block.loading)
const error = computed(() => props.block.error)
const result = computed(() => props.block.result)
const prevCode = computed(() => props.block.prevCode)
const showResult = computed(() => props.showResult)

const code = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const icon = computed(() => {
  if (code.value.trim() != prevCode.value) return 'mdi-play-box'
  if (result.value) return 'mdi-check'
  if (error.value) return 'mdi-exclamation'
  return 'mdi-play'
})

const iconColor = computed(() => {
  if (code.value.trim() != prevCode.value) return 'primary'
  if (result.value) return 'success'
  if (error.value) return 'warning'
  return 'primary'
})

const borderColor = computed(() => {
  if (code.value.trim() != prevCode.value) return 'grey-darken-4'
  if (result.value) return 'green-darken-4'
  if (error.value) return 'deep-orange-darken-4'
  return 'grey-darken-4'
})

const extensions = [javascript(), oneDark]

const handleReady = (payload) => {
  view.value = payload.view
  payload.container.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key == 'Enter') {
      event.preventDefault()
      emit('execute')
    }
  })
}
</script>

<template>
  <div class="d-flex">
    <v-btn
      :icon="icon"
      :loading="loading"
      :color="iconColor"
      class="mr-2"
      variant="plain"
      size="small"
      @click="emit('execute')"
    ></v-btn>

    <v-card class="flex-grow-1 flex-shrink-0 pa-1" rounded="lg" :color="borderColor">
      <v-sheet class="overflow-hidden outlined-sheet" rounded>
        <codemirror
          v-model="code"
          :autofocus="true"
          :indent-with-tab="true"
          :tab-size="2"
          :extensions="extensions"
          placeholder="Code goes here..."
          @ready="handleReady"
        ></codemirror>
      </v-sheet>

      <div v-if="(result && showResult) || error" class="mt-1">
        <v-sheet class="overflow-hidden outlined-sheet" rounded>
          <JSONResult v-if="result" :value="result" />
          <pre v-else class="m-0">{{ error }}</pre>
        </v-sheet>
      </div>
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

<style scoped>
.outlined-sheet {
  border: 1px solid rgba(0, 0, 0, 0.5);
}

.outlined-sheet .success {
  border-color: var(--v-success-base);
}
</style>
