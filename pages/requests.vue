<script setup lang="ts">
import { ref } from "vue";
import type { ComputedRef } from "vue";
import { useI18n } from "vue-i18n";
import RequestFilterModal from "~/components/form-elements/modal/RequestFilterModal.vue";
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
import { useManagementStore } from "@/stores/management/management";

interface rowItem {
  id: string;
  name_purchase_request: string;
  manager_who_created: string;
  spectators: string;
  manager_responsible: string;
  data_was_added: string;
  request_status: {
    id: number;
    name: string;
    color: string;
    is_default: boolean;
  };
}

const store = useManagementStore();
const { t } = useI18n();

const acquisitions = ref<rowItem[]>([]);
const dataReadyForTable = ref<rowItem[]>([]);
const breadcrumbs = ref([
  {
    text: "Cereri de Achiziții",
    disabled: false,
    href: "#",
  },
]);

const pagination = ref(1);
const itemsPerPage = ref(5);
const pageCount = ref(1);
const headers: ComputedRef = computed(() => [
  { title: "Id", align: "start", value: "id" },
  { title: t("name_purchase_request"), align: "start", value: "name_purchase_request" },
  {
    title: t("manager_who_created"),
    align: "start",
    value: "manager_who_created",
  },
  { title: t("spectators"), align: "start", value: "spectators" },
  {
    title: t("manager_responsible"),
    align: "start",
    value: "manager_responsible",
  },
  { title: t("data_was_added"), align: "start", value: "data_was_added" },
  { title: t("request_status"), align: "center", value: "request_status" },
]);

const fetchAcquisitions = async () => {
  if (!store.isAcquisitionsLoaded) {
    await store.fetchAcquisitions();
  }
  acquisitions.value = store.getAcquisitions.results;

  console.log("FETCH getAcquisitions", acquisitions.value);
};

const formatAcquisitionsData = (project: any): rowItem => {
  const created_at = new Date(project.created_at);

  const formattedCreated_At = `${created_at.getFullYear()}-${(
    created_at.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${created_at.getDate().toString().padStart(2, "0")}`;


  return {
    id: project.id.toString(),
    name_purchase_request: project.name,
    manager_who_created: project.created_by.first_name + " " + project.created_by.last_name,
    spectators: "test",
    manager_responsible: project.responsible.first_name + " " + project.responsible.last_name,
    data_was_added: formattedCreated_At,
    request_status: {
      id: project.status.id,
      name: project.status.name,
      color: project.status.color,
      is_default: project.status.is_default,
    },
  };
};

const processAcquisitions = () => {
  const formattedData = acquisitions.value.map(formatAcquisitionsData);
  dataReadyForTable.value = formattedData;
  pageCount.value = Math.ceil(acquisitions.value.length / itemsPerPage.value);
};

onMounted(async () => {
  try {
    await fetchAcquisitions();
    processAcquisitions();
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
});
</script>

<template>
  <BaseBreadcrumb :projectTitle="undefined" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <div class="container_filters py-2">
    <div class="search-wrapper">
      <v-text-field
        append-inner-icon="mdi-magnify"
        :label="t('search_input_text_requests')"
        single-line
        density="compact"
        hide-details
        class="search-field"
      />
    </div>

    <div class="filter-wrapper">
      <RequestFilterModal />
    </div>
  </div>

  <v-card class="border" elevation="0">
    <v-data-table
      items-per-page="5"
      :headers="headers"
      :items="dataReadyForTable"
      @click="console.log('CLICKED ROW)')"
      class="border rounded-md"
    >
      <template v-slot:item.request_status="{ item }">
        <v-chip
          rounded="lg"
          class="font-weight-bold"
          :color="item.request_status.color"
          size="small"
          label
          >{{ item.request_status.name }}</v-chip
        >
      </template>

      <template v-slot:item.settings="{ item }">
        <v-btn icon flat @click="console.log('edited')">
          <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
        </v-btn>
        <v-btn icon flat @click="console.log('edited')">
          <TrashIcon stroke-width="1.5" size="20" class="text-error" />
        </v-btn>
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

.filter-wrapper {
  margin-left: auto;
}

.search-field {
  width: 100%;
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
