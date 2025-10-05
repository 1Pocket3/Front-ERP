import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { LIGHT_THEME, DARK_THEME } from '@/themes';
import { en } from 'vuetify/locale'

// Импортируем только используемые компоненты
import {
  VApp,
  VAppBar,
  VAvatar,
  VBadge,
  VBreadcrumbs,
  VBreadcrumbsItem,
  VBtn,
  VCard,
  VCardActions,
  VCardText,
  VCardTitle,
  VCheckbox,
  VChip,
  VCol,
  VContainer,
  VDataTable,
  VDialog,
  VDivider,
  VFileInput,
  VForm,
  VIcon,
  VImg,
  VLabel,
  VList,
  VListGroup,
  VListItem,
  VListItemSubtitle,
  VListItemTitle,
  VListSubheader,
  VLocaleProvider,
  VMain,
  VMenu,
  VNavigationDrawer,
  VProgressCircular,
  VRow,
  VSelect,
  VSheet,
  VSpacer,
  VTab,
  VTabs,
  VTextarea,
  VTextField,
  VToolbar,
  VTooltip,
} from 'vuetify/components'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components: {
      VApp,
      VAppBar,
      VAvatar,
      VBadge,
      VBreadcrumbs,
      VBreadcrumbsItem,
      VBtn,
      VCard,
      VCardActions,
      VCardText,
      VCardTitle,
      VCheckbox,
      VChip,
      VCol,
      VContainer,
      VDataTable,
      VDialog,
      VDivider,
      VFileInput,
      VForm,
      VIcon,
      VImg,
      VLabel,
      VList,
      VListGroup,
      VListItem,
      VListItemSubtitle,
      VListItemTitle,
      VListSubheader,
      VLocaleProvider,
      VMain,
      VMenu,
      VNavigationDrawer,
      VProgressCircular,
      VRow,
      VSelect,
      VSheet,
      VSpacer,
      VTab,
      VTabs,
      VTextarea,
      VTextField,
      VToolbar,
      VTooltip,
    },
    theme: {
      defaultTheme: 'LIGHT_THEME',
      themes: {
        LIGHT_THEME,
        DARK_THEME,
      },
    },
    icons: {
      defaultSet: 'mdi',
    },
    locale: {
      locale: 'en',
      fallback:'en',
      messages: {
        en,
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
