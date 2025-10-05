import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  if (process.client) {
    // Simple preload for critical resources
    const preloadCriticalResources = () => {
      // Only preload critical CSS if it exists
      try {
        const criticalCSS = document.createElement('link')
        criticalCSS.rel = 'preload'
        criticalCSS.as = 'style'
        criticalCSS.href = '/_nuxt/assets/css/critical.css'
        document.head.appendChild(criticalCSS)
      } catch (error) {
        console.warn('Could not preload critical CSS:', error)
      }
    }
    
    // Run preloading after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', preloadCriticalResources)
    } else {
      preloadCriticalResources()
    }
  }
})
