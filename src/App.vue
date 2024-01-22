<script setup>
import draggable from 'vuedraggable'

import { storeToRefs } from 'pinia'
import { useBlockStore } from './stores/blocks'

import CodeBlock from './components/blocks/CodeBlock.vue'
import TextBlock from './components/blocks/TextBlock.vue'
import ExecuteInput from './components/ExecuteInput.vue'

const { selectedSheet } = storeToRefs(useBlockStore())
const { removeBlock, execute } = useBlockStore()

const onDragEnd = (event) => {
  const { newIndex, oldIndex } = event
  if (newIndex == oldIndex) return
  execute(Math.min(newIndex, oldIndex))
}
</script>

<template>
  <v-app>
    <v-main class="d-flex overflow-hidden">
      <v-container>
        <draggable
          v-model="selectedSheet.blocks"
          :options="{ handle: '.drag-handle' }"
          class="drag-area"
          itemKey="id"
          ghostClass="ghost"
          @end="onDragEnd"
        >
          <template #item="{ element, index }">
            <v-row>
              <v-col>
                <code-block
                  v-if="element.kind == 'code'"
                  v-model="element.code"
                  :block="element"
                  :show-result="index == selectedSheet.blocks.length - 1"
                  @execute="execute(index)"
                  @remove="removeBlock(index)"
                />
                <text-block
                  v-if="element.kind == 'text'"
                  v-model="element.text"
                  :block="element"
                  @remove="removeBlock(index)"
                />
              </v-col>
            </v-row>
          </template>
        </draggable>

        <v-row>
          <v-col>
            <execute-input></execute-input>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.ghost {
  opacity: 0.5;
  border-radius: 0.5rem;
  border: 1px dotted #ccc;
}
</style>
