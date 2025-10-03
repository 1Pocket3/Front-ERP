import { useCustomizerStore } from '@/stores/customizer'

export default defineNuxtPlugin(() => {
  const customizer = useCustomizerStore()
  
  // Initialize theme on client side
  customizer.initializeTheme()
  
  // Watch for theme changes and update Vuetify
  watch(() => customizer.actTheme, (newTheme) => {
    if (process.client) {
      const vuetify = useNuxtApp().$vuetify
      if (vuetify) {
        vuetify.theme.global.name.value = newTheme
      }
    }
  }, { immediate: true })
})
