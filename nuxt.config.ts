import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  // Runtime config for environment variables
  runtimeConfig: {
    // Private keys (only available on server-side)
    apiSecret: '',
    // Public keys (exposed to client-side)
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000',
    }
  },
  
  nitro: {
    devProxy: {
      "/media/": {
        target: "http://127.0.0.1:8000/media/",
        changeOrigin: true,
      },
    },
    // Suppress deprecation warnings in development
    experimental: {
      wasm: false
    }
  },
  plugins: [
    "@/plugins/vue-datepicker.client"
  ],
  ssr: false,
  css: ["@/scss/style.scss", "@/assets/css/performance.css"],

  modules: [
    "@pinia/nuxt",
    'nuxt-mdi',
    "@vee-validate/nuxt",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],

  mdi: {
    cache: "localStorage", // Enable caching for better performance
    componentName: 'MdiIcon',
    defaultSize: '1em'
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    build: {
      // Optimize chunking for better performance
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', 'vue-router', 'pinia'],
            'vuetify': ['vuetify'],
            'icons': ['vue-tabler-icons'],
            'utils': ['axios', 'ohash']
          }
        }
      }
    },
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'vuetify',
        'vue-tabler-icons'
      ]
    }
  },

  build: {
    analyze: false
  },

  // Performance optimizations
  experimental: {
    payloadExtraction: false, // Disable payload extraction for SPA
  },

  devtools: {
    timeline: {
      enabled: false, // Disable in production
    },
  },

  compatibilityDate: "2024-09-16",
});