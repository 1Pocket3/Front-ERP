import { createI18n } from "vue-i18n";
import { ro, ru } from "vuetify/locale";
import { translateRo } from "~/locales/ro";
import { translateRu } from "~/locales/ru";

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: "ru",
    fallbackLocale: "ru",
    messages: {
      ro: { ...translateRo, ro },
      ru: { ...translateRu, ru },
    },
  });

  vueApp.use(i18n);
});
