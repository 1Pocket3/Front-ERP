<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { ComputedRef } from "vue";
import { PencilIcon, TrashIcon } from "vue-tabler-icons";
import FilterModal from "@/components/form-elements/modal/FilterModal.vue";
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
import { useI18n } from "vue-i18n";
import { useProjectsStore } from "@/stores/portfolio/projects/projects";
import { useCustomizerStore } from "@/stores/customizer";
import { useStatusStore } from "@/stores/portfolio/statuses/statuses";

interface Status {
  id: number;
  name: string;
  is_default: boolean;
  color: string;
}

interface StatusesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Status[];
}

interface ProjectStatus {
  id: number;
  name: string;
  color: string;
  is_default: boolean;
}

interface ProjectManager {
  first_name: string;
  last_name: string;
}

interface RowItem {
  id: number;
  project_name: string;
  project_status: ProjectStatus;
  project_manager: ProjectManager;
  start_date: string;
  end_date: string;
  settings: any;
}

const { t } = useI18n();
const store = useProjectsStore();
const customizer = useCustomizerStore();
const statusStore = useStatusStore();
const projects = ref<RowItem[]>([]);
const statuses = ref<StatusesResponse | null>(null);
const typeAlert = ref("success");

const loading = ref(false);
const dialogDelete = ref(false);
const dataReadyForTable = ref<RowItem[]>([]);

const pagination = ref(1);
const itemsPerPage = ref(5);
const pageCount = ref(1);
const headers: ComputedRef = computed(() => [
  { title: "Id", align: "start", key: "id" },
  { title: t("project_name"), align: "start", key: "project_name" },
  { title: t("project_manager"), align: "start", key: "project_manager" },
  { title: t("start_date"), align: "start", key: "start_date" },
  { title: t("end_date"), align: "start", key: "end_date" },
  { title: t("project_status"), align: "start", key: "project_status" },
  { title: t("settings"), align: "center", key: "settings" },
]);

const fetchProjects = async () => {
  await store.fetchProjects();
  projects.value = store.getProjects.results.map(formatProjectData);
};

const formatProjectData = (project: any): RowItem => {
  const startDate = new Date(project.start_date);
  const endDate = new Date(project.end_date);

  const formattedStartDate = `${startDate.getFullYear()}-${(
    startDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${startDate.getDate().toString().padStart(2, "0")}`;
  const formattedEndDate = `${endDate.getFullYear()}-${(endDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${endDate.getDate().toString().padStart(2, "0")}`;

  return {
    id: project.id,
    project_name: project.project_name,
    project_status: {
      id: project.project_status.id,
      name: project.project_status.name,
      color: project.project_status.color,
      is_default: project.project_status.is_default,
    },
    //@ts-ignore
    manager: {
      name: project.manager.name,
      // last_name: project.manager.last_name,
    },
    start_date: formattedStartDate,
    end_date: formattedEndDate,
    settings: project.settings,
  };
};

const processProjects = () => {
  dataReadyForTable.value = projects.value;
  pageCount.value = Math.ceil(projects.value.length / itemsPerPage.value);
};

const viewProject = (project: RowItem) => {
  return navigateTo(`/project/${project.id}`);
};

const toggleDeleteDialog = (id: number) => {
  dialogDelete.value = !dialogDelete.value;
};

const deleteProject = async (id: number) => {
  dialogDelete.value = true;
  try {
    await store.deleteProject(id);
    customizer.toggleAlertVisibility();
    typeAlert.value = "error";
    await fetchProjects();
    processProjects();
    dialogDelete.value = false;
  } catch (error) {
    console.error("Error deleting project:", error);
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([fetchProjects(), statusStore.fetchStatuses()]);
    statuses.value = statusStore.getStatuses;
    processProjects();
    loading.value = false;
  } catch (error) {
    console.error("Error fetching projects:", error);
    loading.value = false;
  }
});
</script>

<template>
  <BaseBreadcrumb :project-title="dataReadyForTable[0]?.project_name" />
  <div class="mt-2 alert-container" v-if="customizer.showAlert">
    <Alerts :t="t" :type="typeAlert" />
  </div>

  <div class="container_filters py-4">
    <div class="search-wrapper">
      <v-text-field
        :label="t('search_input_text_projects')"
        single-line
        density="compact"
        hide-details
        class="search-field"
      />
    </div>

    <div class="filter-wrapper">
      <FilterModal />
    </div>
  </div>

  <v-card elevation="0">
    <v-data-table
      items-per-page="5"
      page="1"
      :headers="headers"
      item-key="id"
      :items="dataReadyForTable"
      class="border rounded-md table-hover"
      :loading="loading"
    >
      <template v-slot:item="{ item }">
        <tr @click="viewProject(item)" style="cursor: pointer">
          <td>{{ item.id }}</td>
          <td>{{ item.project_name }}</td>
          <td>
            <v-chip color="primary" class="text-body-2">
              <v-avatar start size="25">
                <img src="@/assets/images/profile/user-1.jpg" width="25" />
              </v-avatar>
              {{ `${item.manager.name}` }}
            </v-chip>
          </td>
          <td>{{ item.start_date }}</td>
          <td>{{ item.end_date }}</td>
          <td>
            <v-chip
              rounded="lg"
              class="font-weight-bold"
              :color="item.project_status.color"
              size="small"
              label
            >
              {{ item.project_status.name }}
            </v-chip>
          </td>
          <td>
            <div class="action-btn">
              <div @click.stop="">
                <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                <v-tooltip
                  activator="parent"
                  location="top"
                  style="font-size: small"
                  >Edit</v-tooltip
                >
              </div>

              <div @click.stop="toggleDeleteDialog(item.id)">
                <TrashIcon stroke-width="1.5" size="20" class="text-error" />
                <v-tooltip
                  activator="parent"
                  location="top"
                  style="font-size: small"
                  >Delete</v-tooltip
                >
              </div>
            </div>
          </td>
        </tr>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5 text-center py-6"
              >Sigur doriți să ștergeți acest proiect?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="error"
                variant="flat"
                dark
                @click="toggleDeleteDialog"
                >Anulare</v-btn
              >
              <v-btn
                color="success"
                variant="flat"
                dark
                @click="deleteProject(item.id)"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
    </v-data-table>
  </v-card>
</template>

<style scoped lang="scss">
.container_filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-wrapper {
  width: 40%;
}

.table-hover tr:hover {
  background-color: #f2f2f2;
}

.filter-wrapper {
  margin-left: auto;
}

.search-field {
  width: 100%;
}

.action-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-right: 18px;
  div {
    cursor: pointer;
  }
}

@media (max-width: 600px) {
  .container_filters {
    flex-direction: column;
    align-items: end;
  }

  .filter-wrapper {
    margin-left: 0;
    margin-bottom: 4px;
  }

  .search-wrapper {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>
