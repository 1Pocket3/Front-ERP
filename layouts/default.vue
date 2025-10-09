<script setup lang="ts">
import { useAuthStore } from "@/stores/auth/auth";
import { useCustomizerStore } from "@/stores/customizer";
import { defineAsyncComponent, ref } from "vue";

// Lazy load heavy components
const VerticalSidebarVue = defineAsyncComponent(() => import("@/components/vertical-sidebar/VerticalSidebar.vue"));
const VerticalHeaderVue = defineAsyncComponent(() => import("@/components/vertical-header/VerticalHeader.vue"));

const route = useRoute();
const customizer = useCustomizerStore();
const authStore = useAuthStore();
const isLoading = ref(true);

// Initialize app on mount
onMounted(async () => {
  try {
    // Шаг 2: Инициализируем тему (некритично)
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        customizer.initializeTheme();
      });
    } else {
      customizer.initializeTheme();
    }
  } catch (error) {
    console.error('Error initializing layout:', error);
  } finally {
    isLoading.value = false;
  }
});

onBeforeMount(async () => {
  if (!route.path.startsWith('/auth')) {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken && !authStore.getCurrentUser) {
        console.log('🚀 Layout: Loading user data...');
        await authStore.fetchCurrentUser();
        console.log('✅ Layout: User data loaded, isAdmin:', authStore.getIsAdmin);
      }
    }
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
      <!-- Global loading indicator while initializing -->
      <v-progress-linear
        v-if="isLoading && !route.path.startsWith('/auth')"
        indeterminate
        color="primary"
        height="3"
        style="position: fixed; top: 0; left: 0; right: 0; z-index: 9999;"
      />

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
