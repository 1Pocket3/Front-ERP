import { createI18n } from "vue-i18n";
import { en } from "vuetify/locale";
import { translateEn } from "~/locales/en";

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: "en",
    fallbackLocale: "en",
    messages: {
      en: { ...translateEn, en },
    },
  });

  vueApp.use(i18n);
});
