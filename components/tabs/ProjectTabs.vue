<script setup lang="ts">
import { ref } from "vue";
import type { Project } from "@/pages/project/[id].vue";
import { useI18n } from "vue-i18n";
import { PencilIcon, TrashIcon } from "vue-tabler-icons";
import Statusbar from "./Statusbar/Statusbar.vue";
import { useStatusStore } from "@/stores/portfolio/statuses/statuses";
import type { Status } from "@/stores/portfolio/statuses/statuses";

const { t } = useI18n();
const statusStore = useStatusStore();

interface Tabs {
  value: string;
  color: string;
  label: string;
}

interface editedData {
  project_name?: string;
  project_status?: string;
  manager_first_name?: string;
  manager_last_name?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  comment?: string;
  location_city?: string;
  location_street?: string;
}
const tab = ref<Tabs | null>(null);
const statuses = ref<Status[]>([]);

const editDialog = ref(false);

const tabsData: ComputedRef = computed(() => [
  { value: "about", color: "secondary", label: t("about_project") },
  { value: "purchases", color: "warning", label: t("procurement_requests") },
  { value: "materials", color: "primary", label: t("materials") },
  { value: "employees", color: "secondary", label: t("employees") },
  { value: "teams", color: "warning", label: t("teams") },
  { value: "workforce", color: "primary", label: t("workforce") },
  {
    value: "equipment",
    color: "secondary",
    label: t("construction_equipment"),
  },
  { value: "approvals", color: "warning", label: t("goods_acceptance") },
  { value: "suppliers", color: "primary", label: t("suppliers") },
]);

const { project, currentProjectId } = defineProps<{
  project: Project | null;
  currentProjectId: number | undefined;
}>();

const editedProject = ref<editedData>({
  project_name: project?.project_name,
  project_status: project?.project_status.name,
  manager_first_name: project?.manager.first_name,
  manager_last_name: project?.manager.last_name,
  start_date: project?.start_date,
  end_date: project?.end_date,
  description: project?.description,
  comment: project?.comment,
  location_city: project?.location.city,
  location_street: project?.location.street,
});

const openFile = (fileUrl: string) => {
  window.open(fileUrl, '_blank');
};

// Добавляем методы для открытия и закрытия попапа
const openEditDialog = () => {
  editDialog.value = true;
};

const closeEditDialog = () => {
  editDialog.value = false;
};

onMounted(async () => {
  statuses.value = statusStore.getStatuses.results;
});
</script>

<template>
  <div v-if="project">
    <div class="tabs-container">
      <v-tabs v-model="tab">
        <v-tab v-for="tab in tabsData" :key="tab.value" :value="tab.value" :color="tab.color">{{ tab.label }}</v-tab>
      </v-tabs>
    </div>
    <v-card-text class="bg-white rounded-md">
      <v-window v-model="tab">
        <v-window-item value="about">
          <Statusbar :statuses="statuses" :currentProjectId="currentProjectId" />
          <v-card class="mt-2" variant="outlined">
            <v-card-item>
              <div class="mb-4 project-header">
                <h4 class="text-h5 font-weight-bold">
                  {{ t("project_details") }}
                </h4>
                <!-- <button class="edit-btn" @click="openEditDialog">Edit</button> -->
                <v-btn icon flat @click.stop="openEditDialog">
                  <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                  <v-tooltip activator="parent" location="top" style="font-size: small">Edit</v-tooltip>
                </v-btn>
              </div>
              <!-- <p><strong>ID:</strong> {{ project.id }}</p> -->
              <p>
                <strong>{{ t("project_name") }}:</strong>
                {{ project.project_name }}
              </p>
              <p>
                <strong>{{ t("project_type") }}:</strong>
                {{ project.project_type.name }}
              </p>
              <p>
                <strong>{{ t("location") }}:</strong>
                {{ project.location.country }}, {{ project.location.city }}, {{ project.location.street }}
              </p>
              <!-- <p>
                <strong>{{ t("project_stage") }}:</strong>
                {{ project.project_status.name }}
              </p> -->
              <p>
                <strong>{{ t("start_date") }}:</strong>
                {{ new Date(project.start_date).toLocaleDateString() }}
              </p>
              <p>
                <strong>{{ t("end_date") }}:</strong>
                {{ new Date(project.end_date).toLocaleDateString() }}
              </p>
              <p>
                <strong>{{ t("project_manager") }}:</strong>
                {{ project.manager.first_name }}
                {{ project.manager.last_name }}
              </p>
              <!-- <p>
                <strong>{{ t("additional_text") }}:</strong>
                {{ project.description }}
              </p> -->
              <p>
                <strong>{{ t("project_description") }}:</strong>
                {{ project.comment }}
              </p>
              <!-- <p>
                <strong>{{ t("attached_file") }}:</strong>
                  <v-btn style="margin: 10px; height: 30px;" @click="openFile(project.attached_files[0].file)">
                    <span >Просмотреть файл</span>
                  </v-btn>
              </p> -->
            </v-card-item>
          </v-card>
        </v-window-item>

        <!-- остальные окна вкладок -->
        <v-window-item value="purchases">purchases</v-window-item>
        <v-window-item value="materials">materials</v-window-item>
      </v-window>
    </v-card-text>

    <!-- Попап для редактирования -->
    <v-dialog v-model="editDialog" max-width="800px">
      <v-card>
        <v-card-title>Edit Project</v-card-title>
        <v-card-text>
          <v-text-field v-model="project.project_name" label="Project Name"></v-text-field>
          <v-text-field v-model="project.project_status" label="Project Status"></v-text-field>
          <v-text-field v-model="project.manager.first_name" label="Manager First Name"></v-text-field>
          <v-text-field v-model="project.manager.last_name" label="Manager Last Name"></v-text-field>
          <v-text-field v-model="project.start_date" label="Start Date"></v-text-field>
          <v-text-field v-model="project.end_date" label="End Date"></v-text-field>
          <v-text-field v-model="project.description" label="Additional Text"></v-text-field>
          <v-text-field v-model="project.comment" label="Project Description"></v-text-field>
          <v-text-field v-model="project.location.city" label="Location City"></v-text-field>
          <v-text-field v-model="project.location.street" label="Location Street"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="console.log('saved')">Save</v-btn>
          <v-btn color="error" @click="closeEditDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <div v-else>Data loading...</div>
</template>

<style scoped lang="scss">
.tabs-container {
  display: flex;
  justify-content: space-between;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.edit-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn:hover {
  background-color: #0056b3;
}
</style>
