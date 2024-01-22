<script setup>
import { storeToRefs } from 'pinia'
import { useBlockStore } from './stores/blocks'

import CodeBlock from './components/blocks/CodeBlock.vue'
import TextBlock from './components/blocks/TextBlock.vue'
import ExecuteInput from './components/ExecuteInput.vue'

const { selectedSheet } = storeToRefs(useBlockStore())
const { removeBlock, execute } = useBlockStore()
</script>

<template>
  <v-app>
    <v-main class="d-flex overflow-hidden">
      <v-container>
        <v-row v-for="(block, index) in selectedSheet.blocks" :key="index">
          <v-col>
            <code-block
              v-if="block.kind == 'code'"
              v-model="block.code"
              :block="block"
              :show-result="index == selectedSheet.blocks.length - 1"
              @execute="execute(index)"
              @remove="removeBlock(index)"
            />
            <text-block
              v-if="block.kind == 'text'"
              v-model="block.text"
              :block="block"
              @remove="removeBlock(index)"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <execute-input></execute-input>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
