<template>
  <v-btn
    :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
    variant="text"
    size="small"
    @click="toggleTheme"
    class="theme-toggle-btn"
  >
    <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
    <v-tooltip activator="parent" location="bottom">
      {{ isDark ? $t('switch_to_light_mode') : $t('switch_to_dark_mode') }}
    </v-tooltip>
  </v-btn>
</template>

<script setup lang="ts">
import { useCustomizerStore } from '@/stores/customizer'

const customizer = useCustomizerStore()
const isDark = computed(() => customizer.isDark)

const toggleTheme = () => {
  customizer.toggleTheme()
}
</script>

<style scoped>
.theme-toggle-btn {
  transition: all 0.3s ease;
}

.theme-toggle-btn:hover {
  transform: scale(1.1);
}
</style>
