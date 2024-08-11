import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { LIGHT_THEME } from '@/themes/LightTheme';
import { ro, ru } from 'vuetify/locale'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'LIGHT_THEME',
      themes: {
        LIGHT_THEME,
      },
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    locale: {
      locale: 'ro',
      fallback:'ro',
      messages: {
        ro,
        ru,
      },
    },
    defaults: {
      VCard: {
        rounded: 'md',
      },
      VTextField: {
        variant: 'outlined',
        density: 'comfortable',
        color: 'primary',
      },
      VTextarea: {
        variant: 'outlined',
        density: 'comfortable',
        color: 'primary',
      },
      VSelect: {
        variant: 'outlined',
        density: 'comfortable',
        color: 'primary',
      },
      VListItem: {
        minHeight: '45px',
      },
      VTooltip: {
        location: 'top',
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
