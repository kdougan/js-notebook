<script setup>
import { storeToRefs } from 'pinia'
import { useBlockStore } from '@/stores/blocks'
import { useSettingsStore } from '@/stores/settings'

const { selectedSheet } = storeToRefs(useBlockStore())
const { activeEnvs, isOpen, entityTypes } = storeToRefs(useSettingsStore())
</script>

<template>
  <v-row>
    <v-col class="d-flex" cols="3">
      <v-btn size="small" icon="mdi-cog" variant="plain" @click="isOpen = true"></v-btn>

      <v-select
        label="Environment"
        v-model="selectedSheet.env"
        :items="activeEnvs"
        item-title="title"
        item-value="name"
        density="compact"
        variant="solo-filled"
        hide-details
      ></v-select>
    </v-col>

    <v-col cols="3">
      <v-select
        label="Entity Type"
        v-model="selectedSheet.entityType"
        :items="entityTypes"
        item-title="title"
        item-value="value"
        density="compact"
        variant="solo-filled"
        hide-details
      ></v-select>
    </v-col>

    <v-col cols="6">
      <v-text-field
        label="Entity ID"
        v-model="selectedSheet.entityId"
        density="compact"
        variant="solo-filled"
        hide-details
      ></v-text-field>
    </v-col>
  </v-row>
</template>
