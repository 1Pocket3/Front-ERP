import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
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
  },

  devtools: {
    timeline: {
      enabled: true,
    },
  },

  compatibilityDate: "2024-09-16",
});