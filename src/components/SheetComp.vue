<script setup>
import { reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useSheetStore } from '@/stores/sheet'
import InkMde from 'ink-mde/vue'

const sheetStore = useSheetStore()
const { currentSheet } = storeToRefs(sheetStore)

const options = reactive({
  interface: {
    attribution: false,
    appearance: 'dark'
  }
})
</script>

<template>
  <ink-mde v-model="currentSheet.text" :options="options" />
</template>

<style>
.outlined-sheet {
  border: 1px solid rgba(0, 0, 0, 0.5);
}
</style>
