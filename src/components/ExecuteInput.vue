<script setup>
import { useBlockStore } from '@/stores/blocks'
const { blockTypes, addBlock, executeAll } = useBlockStore()
</script>
<template>
  <div class="d-flex justify-center my-2">
    <div class="buttons">
      <v-menu location="center">
        <template v-slot:activator="{ props }">
          <v-btn class="mx-2" prepend-icon="mdi-plus" v-bind="props">Add Block</v-btn>
        </template>

        <v-list>
          <v-list-item v-for="item in blockTypes" :key="item.value" @click="addBlock(item.value)">
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn class="mx-2" prepend-icon="mdi-animation-play" @click="executeAll">Run All</v-btn>
    </div>
  </div>
</template>
