<script setup lang="ts">
import { useCustomizerStore } from "@/stores/customizer";
import VerticalSidebarVue from "@/components/vertical-sidebar/VerticalSidebar.vue";
import VerticalHeaderVue from "@/components/vertical-header/VerticalHeader.vue";

const route = useRoute();
const customizer = useCustomizerStore();

// Initialize theme on mount
onMounted(() => {
  customizer.initializeTheme();
});
</script>

<template>
  <v-locale-provider>
    <v-app
      :theme="customizer.actTheme"
      :class="[
        customizer.actTheme,
        customizer.mini_sidebar ? 'mini-sidebar' : '',
        customizer.setHorizontalLayout ? 'horizontalLayout' : 'verticalLayout',
        customizer.setBorderCard ? 'cardBordered' : '',
      ]"
    >
      <template v-if="!route.path.startsWith('/auth')">
        <VerticalSidebarVue
          :customizer="customizer"
          :miniSidebar="customizer.mini_sidebar"
          v-if="!customizer.setHorizontalLayout"
        />
        <VerticalHeaderVue
          :customizer="customizer"
          v-if="!customizer.setHorizontalLayout"
        />
      </template>

      <v-main>
        <v-container fluid class="page-wrapper pb-sm-15 pb-10">
          <slot />
        </v-container>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>
