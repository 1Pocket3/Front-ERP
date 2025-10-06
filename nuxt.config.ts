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
  css: ["@/scss/style.scss"],

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
    cache: false,
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
      // Remove manual chunks to avoid initialization order issues
      rollupOptions: {
        output: {
          // Let Vite handle chunking automatically
        }
      }
    },
    // Remove optimizeDeps to avoid initialization issues
    // optimizeDeps: {
    //   include: [
    //     'vue',
    //     'vue-router',
    //     'pinia'
    //   ]
    // },
    // Simplified configuration for stability
  },

  build: {
    analyze: false
  },

  // Production optimizations removed for stability

  devtools: {
    timeline: {
      enabled: true,
    },
  },

  compatibilityDate: "2024-09-16",
});