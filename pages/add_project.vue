<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
import FileMultiple from "@/components/form-elements/fileinput/FileInputMultiple.vue";
import { useStatusStore } from "@/stores/portfolio/statuses/statuses";
import { useProjectsStore } from "@/stores/portfolio/projects/projects";
import { useCustomizerStore } from "@/stores/customizer";
import { useTypesStore } from "@/stores/portfolio/types/types";
import { useAuthStore } from "@/stores/auth/auth";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useLocale } from "vuetify";

import type { TypesResponse } from "@/stores/portfolio/types/types";
import type {
  Status,
  StatusesResponse,
} from "@/stores/portfolio/statuses/statuses";
import type { UserResponse, User } from "@/stores/auth/auth";

const { t } = useI18n();
const store = useProjectsStore();
const customizerStore = useCustomizerStore();
const statusesStore = useStatusStore();
const typesStore = useTypesStore();
const authStore = useAuthStore();
const vuetifyLocale = useLocale();

interface ObjectTypes {
  id: number;
  name: string;
  is_default: boolean;
}

type ProjectData = {
  project_status_id: number;
  project_type_id: number;
  location: {
    country: string;
    city: string;
    street: string;
  };
  manager_id: number;
  project_name: string;
  start_date: string;
  end_date: string;
  description: string;
  comment: string;
};

const object_type = ref<ObjectTypes[]>([]);
const project_stage = ref<Status[]>([]);
const users = ref<User[]>([]);
const projectType = ref<ObjectTypes | null>(null);
const projectManager = ref<User | null>(null);
const projectStage = ref<Status | null>(null);

const project_name = ref("");
const country = ref("");
const city = ref("");
const street = ref("");
const startDate = ref("");
const endDate = ref("");
const projectDescription = ref("");
const additionalText = ref("");
const attachedFiles = ref<File[]>([]);

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    return (attachedFiles.value = Array.from(input.files));
  }
};

const collectValues = async () => {
  const formFiles = new FormData();

  const projectData = {
    project_status: projectStage.value ? projectStage.value.id : 0,
    project_type: projectType.value ? projectType.value.id : 0,
    location: {
      country: country.value,
      city: city.value,
      street: street.value,
    },
    manager: projectManager.value ? projectManager.value.id : 0,
    project_name: project_name.value,
    start_date: startDate.value,
    end_date: endDate.value,
    description: projectDescription.value,
    comments: additionalText.value,
  };

  for (let file of attachedFiles.value) {
    formFiles.append("attached_files", file);
  }

  await sendProjectData(projectData, formFiles);
};

const sendProjectData = async (
  projectData: ProjectData,
  formFiles: any | null
) => {
  try {
    const response = await store.addProject(projectData);
    if (response) {
      await store.patchProject(response.id, formFiles);
      customizerStore.toggleAlertVisibility();
      return navigateTo("/projects");
    }
  } catch (error) {
    console.error("Error creating project:", error);
  }
};

const backToProjects = () => {
  return navigateTo("/projects");
};

onMounted(async () => {
  try {
    await authStore.fetchUsers();
    await statusesStore.fetchStatuses();
    await typesStore.fetchTypes();
    //@ts-ignore
    const managers: UserResponse = authStore.getUsers;
    const statuses: StatusesResponse = statusesStore.getStatuses;
    const types: TypesResponse = typesStore.getTypes;

    users.value = managers.items;
    project_stage.value = statuses.results;
    object_type.value = types.results;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
</script>

<template>
  <BaseBreadcrumb :project-title="undefined" />
  <v-row class="mt-2">
    <v-col cols="12" md="8" sm="10">
      <v-label class="mb-2 font-weight-medium">{{
        $t("project_name")
      }}</v-label>
      <v-text-field v-model="project_name" variant="outlined" color="primary" />

      <v-label class="mb-2 font-weight-medium">{{
        $t("project_type")
      }}</v-label>
      <v-select
        v-model="projectType"
        :items="object_type"
        item-title="name"
        item-value="id"
        return-object
        single-line
        variant="outlined"
      />

      <v-label class="mb-2 font-weight-medium">{{ $t("country") }}</v-label>
      <v-text-field v-model="country" variant="outlined" color="primary" />

      <v-label class="mb-2 font-weight-medium">{{ $t("city") }}</v-label>
      <v-text-field v-model="city" variant="outlined" color="primary" />

      <v-label class="mb-2 font-weight-medium">{{ $t("street") }}</v-label>
      <v-text-field v-model="street" variant="outlined" color="primary" />

      <v-label class="mb-2 font-weight-medium">{{ $t("start_date") }}</v-label>
      <VueDatePicker
        v-model="startDate"
        :teleport="true"
        position="left"
        :locale="vuetifyLocale.current.value"
        :cancel-text="t('calendar_cancel_btn')"
        :select-text="t('calendar_save_btn')"
        :enable-time-picker="false"
        required
        :max-date="new Date()"
        :placeholder="t('data_format')"
        :ActionRow.showPreview="false"
        :hide-navigation="['time']"
      />
      <v-label class="mt-4 font-weight-medium">{{ $t("end_date") }}</v-label>
      <VueDatePicker
        v-model="endDate"
        :teleport="true"
        position="left"
        :locale="vuetifyLocale.current.value"
        :cancel-text="t('calendar_cancel_btn')"
        :select-text="t('calendar_save_btn')"
        :enable-time-picker="false"
        required
        :min-date="startDate"
        :placeholder="t('data_format')"
        :ActionRow.showPreview="false"
        :hide-navigation="['time']"
        class="mb-5"
        :disabled="!startDate"
      />

      <v-label class="mb-2 font-weight-medium">{{
        $t("project_manager")
      }}</v-label>
      <v-select
        v-model="projectManager"
        :items="users"
        item-title="name"
        item-value="id"
        return-object
        single-line
        variant="outlined"
      />

      <v-label class="mb-2 font-weight-medium">{{
        $t("project_stage")
      }}</v-label>
      <v-select
        v-model="projectStage"
        :items="project_stage"
        item-title="name"
        item-value="id"
        return-object
        single-line
        variant="outlined"
      />

      <v-label class="mb-2 font-weight-medium">{{
        $t("project_description")
      }}</v-label>
      <v-text-field
        v-model="projectDescription"
        color="primary"
        variant="outlined"
      />

      <v-label
        class="white-space-normal d-flex mb-2 font-weight-medium label-wrap"
        >{{ $t("additional_text") }}</v-label
      >
      <v-text-field
        v-model="additionalText"
        color="primary"
        variant="outlined"
      />

      <div class="mb-6">
        <FileMultiple @change="handleFileChange" />
      </div>
    </v-col>
  </v-row>
  <v-btn @click="backToProjects" color="error" class="mr-3">{{
    $t("cancel")
  }}</v-btn>
  <v-btn @click="collectValues" color="primary">{{ $t("save") }}</v-btn>
</template>

<style lang="scss" scoped>
.label-wrap {
  white-space: normal;
}
</style>
