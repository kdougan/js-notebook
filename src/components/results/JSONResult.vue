<script setup>
import { ref, computed } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
import { githubDark } from '@uiw/codemirror-theme-github'

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  }
})

const view = ref(null)
const value = computed({
  get: () => JSON.stringify(props.value, null, 2),
  set: (value) => value
})
const handleReady = (payload) => {
  view.value = payload.view
}
const extensions = [json(), githubDark]
</script>

<template>
  <codemirror
    v-model="value"
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="extensions"
    :disabled="true"
    @ready="handleReady"
  ></codemirror>
</template>
