<script setup>
const props = defineProps({ item: [Object, String], level: Number });
</script>

<template>
  <template v-if="typeof item === 'string'">
    <!-- MDI иконка -->
    <v-icon 
      :size="level > 0 ? 14 : 20" 
      class="iconClass"
    >
      {{ item }}
    </v-icon>
  </template>
  <template v-else>
    <!-- Компонент иконки (для обратной совместимости) -->
    <component
      :is="item"
      :size="level > 0 ? 14 : 20"
      stroke-width="1.5"
      class="iconClass"
    ></component>
  </template>
</template>
