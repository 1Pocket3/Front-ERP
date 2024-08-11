<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { PlusIcon } from "vue-tabler-icons";
import { useRoute, useRouter } from "vue-router";
import { ref, watch } from "vue";

interface BreadcrumbItem {
  text: string;
  disabled: boolean;
  href: string;
}

const route = useRoute();
const currentPath = ref(route.path);
const props = defineProps<{ projectTitle: string | undefined }>();

const { t, locale } = useI18n();

const breadcrumbs = ref<BreadcrumbItem[]>([]);
const showBtn = ref(false);

const navigateToAddProject = () => {
  switch (currentPath.value) {
    case "/projects":
      return navigateTo("/add_project");
    case "/requests":
      return navigateTo("/add_request");
    default:
      return;
  }
};

const getTitle = () => {
  switch (currentPath.value) {
    case "/projects":
      return t("my_projects");
    case "/requests":
      return t("my_requests");
    case "/add_project":
      return t("add_project");
    case "/add_request":
      return t("add_request");
    case `/project/${route.params.id}`:
      showBtn.value = false;
      return props.projectTitle;
    default:
      return t("default_page");
  }
};

const btnTitle = () => {
  switch (currentPath.value) {
    case "/projects":
      return t("add_project");
    case "/requests":
      return t("add_request");
    default:
      return t("default_page");
  }
};

const getBreadcrumbs = () => {
  switch (currentPath.value) {
    case "/add_project":
      return [{ text: t("my_projects"), disabled: false, href: "/projects" }];
    case "/add_request":
      return [{ text: t("my_requests"), disabled: false, href: "/requests" }];
      case `/project/${route.params.id}`:
      return [{ text: t("my_projects"), disabled: false, href: "/projects" }];
    default:
      return [];
  }
};

// Watch for route changes
watch(
  () => route.path,
  (newPath) => {
    currentPath.value = newPath;
    breadcrumbs.value = getBreadcrumbs();
    showBtn.value = !currentPath.value.startsWith("/add_");
  },
  { immediate: true }
);

// Watch for locale changes
watch(
  () => locale.value,
  () => {
    breadcrumbs.value = getBreadcrumbs();
  }
);

breadcrumbs.value = getBreadcrumbs();
showBtn.value = !currentPath.value.startsWith("/add_" || "/project/");
</script>

<template>
  <v-card class="bg-lightprimary elevation-0 rounded-md">
    <div class="px-8 py-8">
      <v-row>
        <v-col lg="4" md="6">
          <h3 class="text-h6 custom-btn">{{ getTitle() }}</h3>
          <v-breadcrumbs class="text-subtitle-1 font-weight-medium pa-0 ml-n1">
            <v-breadcrumbs-item
              v-for="item in breadcrumbs"
              :key="item.href"
              :disabled="item.disabled"
              @click="!item.disabled && navigateTo(item.href)"
              class="breadcrumbs-custom"
            >
              {{ item.text }}
            </v-breadcrumbs-item>
          </v-breadcrumbs>
        </v-col>

        <v-col cols="12" lg="8" md="6" class="mt-3 text-right">
          <v-btn
            v-if="showBtn"
            @click="navigateToAddProject"
            color="primary"
            flat
            class="ml-auto mb-2 title_btn"
          >
            <PlusIcon style="margin-right: 10px" size="20" />
            <div>{{ btnTitle() }}</div>
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<style scoped lang="scss">
.container {
  background-color: #7c7676;
}

.title_btn {
  text-transform: none;
}

.breadcrumbs-custom:hover {
  cursor: pointer;
  text-decoration: underline;
}

.custom-btn {
  font-weight: bold;
  margin-top: 12px;
}

.page-breadcrumb {
  .v-toolbar {
    background: transparent;
  }
}

@media screen and (max-width: 380px) {
  .responsive-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .responsive-btn {
    font-size: 14px;
    padding: 8px 16px;
    margin-top: 10px;
  }
}
</style>
