import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore(
  'js-notebook-settings',
  () => {
    const codeTheme = ref('nord')

    const isOpen = ref(true)

    return {
      codeTheme,
      isOpen,
    }
  },
  { persist: true }
)
