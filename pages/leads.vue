<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { ComputedRef } from "vue";
import { PencilIcon, TrashIcon, PlusIcon, UploadIcon } from "vue-tabler-icons";
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
import { useI18n } from "vue-i18n";
import { useLeadsStore, type Lead } from "@/stores/leads/leads";
import { useCustomizerStore } from "@/stores/customizer";
import { useAuthStore } from "@/stores/auth/auth";

interface LeadStatus {
  id: number;
  name: string;
  color: string;
  is_default: boolean;
}

interface LeadManager {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface RowItem {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  email?: string;
  company?: string;
  lead_source?: string;
  status: string;
  assigned_to?: LeadManager;
  uploaded_by: LeadManager;
  created_at: string;
  updated_at: string;
}

const { t } = useI18n();
const store = useLeadsStore();
const customizer = useCustomizerStore();
const authStore = useAuthStore();
const leads = ref<RowItem[]>([]);
const typeAlert = ref("success");

const loading = ref(false);
const dialogDelete = ref(false);
const dialogImport = ref(false);
const selectedLeadId = ref<number | null>(null);
const dataReadyForTable = ref<RowItem[]>([]);
const error = ref<string | null>(null);

const pagination = ref(1);
const itemsPerPage = ref(20);
const pageCount = ref(1);
const searchQuery = ref("");
const totalCount = ref(0);
let searchTimeout: number | null = null;
const isFetching = ref(false);
const allUsers = ref<any[]>([]);
const isAdmin = ref(false);

// Filters
const managerFilter = ref<number | null>(null);
const statusFilter = ref<string[]>([]);
const assignedFilter = ref<'any' | 'assigned' | 'unassigned'>('any');

// Bulk assign
const selectedRows = ref<RowItem[]>([]);
const bulkAssignUserId = ref<number | null>(null);

const headers: ComputedRef = computed(() => [
  { title: "ID", align: "start", key: "id", sortable: true },
  { title: t("full_name"), align: "start", key: "full_name", sortable: true },
  { title: t("phone"), align: "start", key: "phone", sortable: true },
  { title: t("email"), align: "start", key: "email", sortable: true },
  { title: t("company"), align: "start", key: "company", sortable: true },
  { title: t("lead_source"), align: "start", key: "lead_source", sortable: true },
  { title: 'Status', align: 'start', key: 'status', sortable: true },
  { title: t("assigned_to"), align: "start", key: "assigned_to", sortable: true },
  { title: t("uploaded_by"), align: "start", key: "uploaded_by", sortable: true },
  { title: t("created_at"), align: "start", key: "created_at", sortable: true },
]);

const fetchLeads = async () => {
  if (isFetching.value) return; // Защита от повторных вызовов
  
  isFetching.value = true;
  loading.value = true;
  error.value = null;
  try {
    await store.fetchLeads({
      search: searchQuery.value,
      manager_id: isAdmin.value && managerFilter.value ? managerFilter.value : undefined,
      status: statusFilter.value && statusFilter.value.length ? statusFilter.value : undefined,
      assigned: assignedFilter.value === 'any' ? undefined : assignedFilter.value === 'assigned',
      page: pagination.value,
      page_size: itemsPerPage.value,
    });
    leads.value = store.getLeads.map(formatLeadData);
    processLeads();
  } catch (err) {
    console.error("Error fetching leads:", err);
    error.value = err instanceof Error ? err.message : 'Ошибка загрузки данных';
    customizer.toggleAlertVisibility();
    typeAlert.value = "error";
  } finally {
    loading.value = false;
    isFetching.value = false;
  }
};

const formatLeadData = (lead: Lead): RowItem => {
  const createdDate = new Date(lead.created_at);
  const updatedDate = new Date(lead.updated_at);
  
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  };

  return {
    id: lead.id,
    first_name: lead.first_name,
    last_name: lead.last_name || '',
    full_name: lead.full_name,
    phone: lead.phone,
    email: lead.email,
    company: lead.company,
    lead_source: lead.lead_source,
    status: lead.status,
    assigned_to: lead.assigned_to ? {
      id: lead.assigned_to.id,
      username: lead.assigned_to.username,
      first_name: lead.assigned_to.first_name,
      last_name: lead.assigned_to.last_name,
      email: lead.assigned_to.email,
      role: lead.assigned_to.role,
    } : undefined,
    uploaded_by: {
      id: lead.uploaded_by.id,
      username: lead.uploaded_by.username,
      first_name: lead.uploaded_by.first_name,
      last_name: lead.uploaded_by.last_name,
      email: lead.uploaded_by.email,
      role: lead.uploaded_by.role,
    },
    created_at: formatDate(createdDate),
    updated_at: formatDate(updatedDate),
  };
};

const processLeads = () => {
  dataReadyForTable.value = leads.value;
  pageCount.value = store.getTotalPages;
  totalCount.value = store.getTotalCount;
};

const viewLead = (lead: RowItem) => {
  return navigateTo(`/lead/${lead.id}`);
};

const toggleDeleteDialog = (id: number) => {
  selectedLeadId.value = id;
  dialogDelete.value = !dialogDelete.value;
};

const deleteLead = async () => {
  if (!selectedLeadId.value) return;
  
  try {
    await store.deleteLead(selectedLeadId.value);
    customizer.toggleAlertVisibility();
    typeAlert.value = "success";
    await fetchLeads();
    dialogDelete.value = false;
    selectedLeadId.value = null;
  } catch (error) {
    console.error("Error deleting lead:", error);
    customizer.toggleAlertVisibility();
    typeAlert.value = "error";
  }
};

const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  searchTimeout = setTimeout(() => {
    pagination.value = 1;
    fetchLeads();
  }, 500); // Задержка 500мс
};

const handlePageChange = (page: number) => {
  pagination.value = page;
  fetchLeads();
};

const handleItemsPerPageChange = (itemsPerPageValue: number) => {
  itemsPerPage.value = itemsPerPageValue;
  pagination.value = 1; // Сбрасываем на первую страницу
  fetchLeads();
};

const getVisiblePages = () => {
  const current = pagination.value;
  const total = pageCount.value;
  const delta = 2; // Количество страниц с каждой стороны от текущей
  
  const range = [];
  const rangeWithDots = [];
  
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i);
  }
  
  if (current - delta > 2) {
    rangeWithDots.push(1, '...');
  } else {
    rangeWithDots.push(1);
  }
  
  rangeWithDots.push(...range);
  
  if (current + delta < total - 1) {
    rangeWithDots.push('...', total);
  } else if (total > 1) {
    rangeWithDots.push(total);
  }
  
  return rangeWithDots.filter((page, index, arr) => arr.indexOf(page) === index);
};

const handleImport = () => {
  dialogImport.value = true;
};

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;

  try {
    await store.importLeads(file);
    customizer.toggleAlertVisibility();
    typeAlert.value = "success";
    dialogImport.value = false;
    await fetchLeads();
  } catch (error) {
    console.error("Error importing leads:", error);
    customizer.toggleAlertVisibility();
    typeAlert.value = "error";
  }
};

const fetchAllUsers = async () => {
  try {
    allUsers.value = await store.getAllUsers();
  } catch (error) {
    console.error('Error fetching all users:', error);
  }
};

const applyFilters = () => {
  pagination.value = 1;
  fetchLeads();
};

const clearFilters = () => {
  managerFilter.value = null;
  statusFilter.value = [];
  assignedFilter.value = 'any';
  pagination.value = 1;
  fetchLeads();
};

const bulkAssign = async () => {
  if (!isAdmin.value || selectedRows.value.length === 0) return;
  try {
    await store.assignLeads(selectedRows.value.map(r => r.id), bulkAssignUserId.value);
    customizer.toggleAlertVisibility();
    typeAlert.value = "success";
    selectedRows.value = [];
    bulkAssignUserId.value = null;
    await fetchLeads();
  } catch (error) {
    console.error('Error bulk assigning leads:', error);
    customizer.toggleAlertVisibility();
    typeAlert.value = "error";
  }
};

const assignLeadToUser = async (leadId: number, userId: number | null) => {
  try {
    await store.assignLeads([leadId], userId);
    customizer.toggleAlertVisibility();
    typeAlert.value = "success";
    await fetchLeads(); // Обновляем данные
  } catch (error) {
    console.error("Error assigning lead:", error);
    customizer.toggleAlertVisibility();
    typeAlert.value = "error";
  }
};

const makeCall = (phoneNumber: string) => {
  if (phoneNumber) {
    // Убираем все символы кроме цифр и +
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
    // Открываем ссылку для звонка
    window.open(`tel:${cleanPhone}`, '_self');
  }
};

const maskPhoneNumber = (phoneNumber: string) => {
  if (!phoneNumber) return phoneNumber;
  
  // Если пользователь админ, показываем полный номер
  if (isAdmin.value) {
    return phoneNumber;
  }
  
  // Для менеджеров показываем только последние 4 цифры
  const digits = phoneNumber.replace(/[^\d]/g, '');
  if (digits.length <= 4) {
    return phoneNumber; // Если номер короткий, показываем как есть
  }
  
  const lastFour = digits.slice(-4);
  const masked = '*'.repeat(digits.length - 4) + lastFour;
  
  // Сохраняем оригинальный формат (пробелы, скобки, дефисы)
  let result = phoneNumber;
  for (let i = 0; i < digits.length - 4; i++) {
    result = result.replace(/\d/, '*');
  }
  
  return result;
};

const getUserDisplayName = (user: any) => {
  return `${user.first_name} ${user.last_name}`.trim() || user.username;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'New':
      return 'default';
    case 'Ftd':
      return 'success';
    case 'Ftd Na':
      return 'info';
    case 'No answer':
      return 'warning';
    case 'Call again':
      return 'primary';
    case 'Money Call':
      return 'info';
    case 'Awaiting Deposit':
      return 'warning';
    case 'Kachin Kachin':
      return 'success';
    case 'Not interested':
      return 'error';
    case 'Reading':
      return 'secondary';
    case 'Risk':
      return 'error';
    default:
      return 'secondary';
  }
};

onMounted(async () => {
  console.log('Leads page mounted');
  await fetchLeads();
  
  // Проверяем, есть ли данные пользователя в store
  console.log('Current user in store:', store.getCurrentUser);
  if (!store.getCurrentUser) {
    console.log('No user data in store, fetching...');
    try {
      await store.fetchCurrentUser();
    } catch (error) {
      console.error('Could not fetch current user:', error);
    }
  } else {
    console.log('User data already in store');
  }
  
  // Устанавливаем флаг админа
  isAdmin.value = store.getIsAdmin;
  console.log('isAdmin set to:', isAdmin.value);
  
  // Загружаем список пользователей только для админов
  if (isAdmin.value) {
    console.log('Loading all users for admin...');
    await fetchAllUsers();
  }
});

onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
});
</script>

<template>
  <!-- <BaseBreadcrumb :project-title="'Лиды'" /> -->
  <div class="mt-2 alert-container" v-if="customizer.showAlert">
    <Alerts :t="t" :type="typeAlert" />
  </div>

  <!-- Error Alert -->
  <v-alert
    v-if="error"
    type="error"
    variant="tonal"
    class="mb-4"
    closable
    @click:close="error = null"
  >
    {{ error }}
  </v-alert>

  <div class="container_filters py-4">
    <div class="search-wrapper">
      <v-text-field
        v-model="searchQuery"
        :label="t('search_leads')"
        single-line
        density="compact"
        hide-details
        class="search-field"
        @input="handleSearch"
        @keyup.enter="handleSearch"
        append-inner-icon="mdi-magnify"
        @click:append-inner="handleSearch"
        clearable
      />
    </div>

    <div class="filter-wrapper">
      <!-- Manager filter (admin only) -->
      <v-select
        v-if="isAdmin"
        :items="allUsers.map(user => ({ ...user, display_name: getUserDisplayName(user) }))"
        item-title="display_name"
        item-value="id"
        density="compact"
        variant="outlined"
        hide-details
        clearable
        style="min-width: 200px;"
        :label="t('assigned_to')"
        v-model="managerFilter"
        @update:model-value="applyFilters"
      />

      <!-- Status filter (multi) -->
      <v-select
        :items="['New','Ftd','Ftd Na','No answer','Call again','Money Call','Awaiting Deposit','Kachin Kachin','Not interested','Reading','Risk']"
        multiple
        density="compact"
        variant="outlined"
        hide-details
        clearable
        style="min-width: 240px;"
        label="Status"
        v-model="statusFilter"
        @update:model-value="applyFilters"
      />

      <!-- Assigned filter -->
      <v-select
        :items="[
          { title: t('all'), value: 'any' },
          { title: t('assigned_to'), value: 'assigned' },
          { title: t('not_assigned'), value: 'unassigned' }
        ]"
        item-title="title"
        item-value="value"
        density="compact"
        variant="outlined"
        hide-details
        style="min-width: 180px;"
        v-model="assignedFilter"
        @update:model-value="applyFilters"
      />

      <v-btn
        color="info"
        variant="outlined"
        @click="fetchLeads"
        :loading="loading"
        class="mr-2"
      >
        <v-icon>mdi-refresh</v-icon>
        Refresh
      </v-btn>
      
      <v-btn
        v-if="isAdmin"
        color="primary"
        variant="outlined"
        @click="handleImport"
        class="mr-2"
      >
        <UploadIcon stroke-width="1.5" size="20" class="mr-2" />
        {{ t('import_leads') }}
      </v-btn>
      
      <v-btn
        color="primary"
        variant="flat"
        @click="navigateTo('/add-lead')"
      >
        <PlusIcon stroke-width="1.5" size="20" class="mr-2" />
        {{ t('add_lead') }}
      </v-btn>
      
      <v-btn
        variant="text"
        @click="clearFilters"
      >
        {{ t('clear') }}
      </v-btn>
      
    </div>
  </div>


  <!-- Search Info -->
  <v-card v-if="searchQuery" elevation="0" class="mb-4">
    <v-card-text class="py-3">
      <div class="d-flex justify-space-between align-center">
        <div class="text-body-2 text-medium-emphasis">
          {{ t('search_leads') }}: "{{ searchQuery }}" - {{ totalCount }} {{ t('results') }}
        </div>
        <v-btn
          color="primary"
          variant="outlined"
          size="small"
          @click="searchQuery = ''; fetchLeads()"
        >
          {{ t('refresh') }}
        </v-btn>
      </div>
    </v-card-text>
  </v-card>

  <v-card elevation="0">
    <v-data-table
      :items-per-page="-1"
      :page="1"
      :headers="headers"
      item-key="id"
      :items="dataReadyForTable"
      :return-object="true"
      v-model="selectedRows"
      show-select
      class="border rounded-md table-hover"
      :loading="loading"
      hide-default-footer
    >
      

      <!-- Bulk actions toolbar -->
      <template v-slot:top>
        <div v-if="isAdmin && selectedRows.length" class="px-4 py-2 d-flex align-center gap-3">
          <div class="text-body-2">{{ t('selected') }}: {{ selectedRows.length }}</div>
          <v-select
            :items="allUsers.map(user => ({ ...user, display_name: getUserDisplayName(user) }))"
            item-title="display_name"
            item-value="id"
            density="compact"
            variant="outlined"
            hide-details
            style="min-width: 220px;"
            :label="t('assign_manager')"
            v-model="bulkAssignUserId"
          />
          <v-btn color="primary" variant="flat" :disabled="bulkAssignUserId===null" @click="bulkAssign">
            {{ t('assign') }}
          </v-btn>
          <v-btn color="error" variant="outlined" @click="() => { bulkAssignUserId = null; selectedRows = []; }">
            {{ t('cancel') }}
          </v-btn>
        </div>
      </template>
      <template v-slot:no-data>
        <div class="text-center py-8">
          <v-icon size="64" color="grey-lighten-1">mdi-database-off</v-icon>
          <h3 class="text-h6 text-grey mt-4">No data</h3>
          <p class="text-body-2 text-grey mt-2">
            {{ searchQuery ? 'No data found for your query' : 'Leads not found' }}
          </p>
          <v-btn
            v-if="searchQuery"
            color="primary"
            variant="outlined"
            class="mt-4"
            @click="searchQuery = ''; fetchLeads()"
          >
            {{ t('clear_search') }}
          </v-btn>
        </div>
      </template>
      <!-- ID column -->
      <template v-slot:item.id="{ item }">
        <span class="text-body-2 font-weight-medium">{{ item.id }}</span>
      </template>

      <!-- Full name with link for middle-click -->
      <template v-slot:item.full_name="{ item }">
        <NuxtLink :to="`/lead/${item.id}`" class="font-weight-medium text-primary" @click.stop>
          {{ item.full_name }}
        </NuxtLink>
      </template>

      <!-- Phone column with call button -->
      <template v-slot:item.phone="{ item }">
        <div v-if="item.phone" class="d-flex align-center gap-2">
          <span class="text-body-2">{{ maskPhoneNumber(item.phone) }}</span>
          <v-btn
            icon="mdi-phone"
            size="small"
            variant="text"
            color="success"
            @click.stop="makeCall(item.phone)"
            class="call-btn"
          >
            <v-icon size="small">mdi-phone</v-icon>
            <v-tooltip activator="parent" location="top">
              {{ t('call') }}
            </v-tooltip>
          </v-btn>
        </div>
        <span v-else class="text-grey">—</span>
      </template>

      <!-- Email column -->
      <template v-slot:item.email="{ item }">
        <span v-if="item.email" class="text-primary">{{ item.email }}</span>
        <span v-else class="text-grey">—</span>
      </template>

      <!-- Company column -->
      <template v-slot:item.company="{ item }">
        <span v-if="item.company" class="font-weight-medium">{{ item.company }}</span>
        <span v-else class="text-grey">—</span>
      </template>

      <!-- Lead source column -->
      <template v-slot:item.lead_source="{ item }">
        <v-chip v-if="item.lead_source" color="success" variant="outlined" size="small">
          {{ item.lead_source }}
        </v-chip>
        <span v-else class="text-grey">—</span>
      </template>

      <!-- Status column -->
      <template v-slot:item.status="{ item }">
        <v-chip :color="getStatusColor(item.status)" size="small" variant="outlined">
          <v-icon start size="x-small" class="mr-1">
            {{ getStatusColor(item.status) === 'success' ? 'mdi-check' :
               getStatusColor(item.status) === 'error' ? 'mdi-close' :
               getStatusColor(item.status) === 'warning' ? 'mdi-alert' :
               getStatusColor(item.status) === 'info' ? 'mdi-information' :
               getStatusColor(item.status) === 'primary' ? 'mdi-star' :
               'mdi-circle-outline' }}
          </v-icon>
          {{ item.status }}
        </v-chip>
      </template>

      <!-- Assigned to column -->
      <template v-slot:item.assigned_to="{ item }">
        <div v-if="isAdmin" class="d-flex align-center" @click.stop>
          <v-select
            v-if="!item.assigned_to"
            :items="allUsers.map(user => ({ ...user, display_name: getUserDisplayName(user) }))"
            item-title="display_name"
            item-value="id"
            density="compact"
            variant="outlined"
            hide-details
            :placeholder="t('assign_manager')"
            class="assign-select"
            @update:model-value="(userId) => assignLeadToUser(item.id, userId)"
            @click.stop
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :title="getUserDisplayName(item.raw)">
                <template v-slot:subtitle>
                  <v-chip size="x-small" :color="item.raw.role === 'admin' ? 'error' : 'primary'">
                    {{ item.raw.role }}
                  </v-chip>
                </template>
              </v-list-item>
            </template>
          </v-select>
          <div v-else class="d-flex align-center gap-2">
            <v-chip color="primary" size="small" class="text-body-2">
              {{ `${item.assigned_to.first_name} ${item.assigned_to.last_name}` }}
            </v-chip>
            <v-btn
              icon="mdi-close"
              size="x-small"
              variant="text"
              color="error"
              @click.stop="assignLeadToUser(item.id, null)"
            >
              <v-tooltip activator="parent">
                {{ t('unassign') }}
              </v-tooltip>
            </v-btn>
          </div>
        </div>
        <div v-else>
          <v-chip v-if="item.assigned_to" color="primary" size="small" class="text-body-2">
            {{ `${item.assigned_to.first_name} ${item.assigned_to.last_name}` }}
          </v-chip>
        <v-chip v-else color="grey" variant="outlined" size="small">
            {{ t('not_assigned') }}
          </v-chip>
        </div>
      </template>

      <!-- Uploaded by column -->
      <template v-slot:item.uploaded_by="{ item }">
        <v-chip color="secondary" size="small" class="text-body-2">
          {{ `${item.uploaded_by.first_name || item.uploaded_by.username} ${item.uploaded_by.last_name || ''}` }}
        </v-chip>
      </template>

      <!-- Created at column -->
      <template v-slot:item.created_at="{ item }">
        <span class="text-body-2 text-medium-emphasis">{{ item.created_at }}</span>
      </template>
    </v-data-table>
    
    <!-- Custom Pagination Footer -->
    <v-card-text class="py-3">
      <div class="d-flex justify-space-between align-center flex-wrap gap-3">
        <!-- Items per page selector -->
        <div class="d-flex align-center gap-2">
          <span class="text-body-2 text-medium-emphasis">{{ t('records_per_page') }}:</span>
          <v-select
            :model-value="itemsPerPage"
            :items="[10, 20, 50, 100]"
            density="compact"
            variant="outlined"
            hide-details
            style="min-width: 80px;"
            @update:model-value="handleItemsPerPageChange"
          />
        </div>
        
        <!-- Pagination info -->
        <div class="text-body-2 text-medium-emphasis">
          {{ (pagination - 1) * itemsPerPage + 1 }}-{{ Math.min(pagination * itemsPerPage, totalCount) }} из {{ totalCount }}
        </div>
        
        <!-- Pagination controls -->
        <div class="d-flex align-center gap-1">
          <v-btn
            icon="mdi-chevron-double-left"
            size="small"
            variant="text"
            :disabled="pagination === 1"
            @click="handlePageChange(1)"
          />
          <v-btn
            icon="mdi-chevron-left"
            size="small"
            variant="text"
            :disabled="pagination === 1"
            @click="handlePageChange(pagination - 1)"
          />
          
          <!-- Page numbers -->
          <div class="d-flex align-center gap-1 mx-2">
            <template v-for="page in getVisiblePages()" :key="page">
              <v-btn
                v-if="page !== '...'"
                :variant="page === pagination ? 'flat' : 'text'"
                :color="page === pagination ? 'primary' : 'default'"
                size="small"
                @click="handlePageChange(page as number)"
                class="min-width-40"
              >
                {{ page }}
              </v-btn>
              <span v-else class="text-body-2 text-medium-emphasis px-2">...</span>
            </template>
          </div>
          
          <v-btn
            icon="mdi-chevron-right"
            size="small"
            variant="text"
            :disabled="pagination === pageCount"
            @click="handlePageChange(pagination + 1)"
          />
          <v-btn
            icon="mdi-chevron-double-right"
            size="small"
            variant="text"
            :disabled="pagination === pageCount"
            @click="handlePageChange(pageCount)"
          />
        </div>
      </div>
    </v-card-text>
  </v-card>

  <!-- Delete Dialog -->
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-card-title class="text-h5 text-center py-6">
        {{ t('confirm_delete_lead') }}
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          variant="outlined"
          @click="dialogDelete = false"
        >
          {{ t('cancel') }}
        </v-btn>
        <v-btn
          color="error"
          variant="flat"
          @click="deleteLead"
        >
          {{ t('delete') }}
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Import Dialog -->
  <v-dialog v-model="dialogImport" max-width="500px">
    <v-card>
      <v-card-title class="text-h5 text-center py-6">
        {{ t('import_leads') }}
      </v-card-title>
      <v-card-text>
        <v-file-input
          :label="t('select_file')"
          accept=".csv,.xlsx,.xls"
          @change="handleFileUpload"
          prepend-icon=""
          prepend-inner-icon="mdi-file-upload"
        />
        <p class="text-caption mt-2">
          {{ t('supported_formats') }}: CSV, Excel (.xlsx, .xls)
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="outlined"
          @click="dialogImport = false"
        >
          {{ t('cancel') }}
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.table-row {
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: rgba(var(--v-theme-primary), 0.08) !important;
}

.filter-wrapper {
  margin-left: auto;
  display: flex;
  gap: 8px;
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

.min-width-40 {
  min-width: 40px !important;
}

.assign-select {
  min-width: 150px;
  max-width: 200px;
}

.call-btn {
  opacity: 0.8;
  transition: opacity 0.2s ease;
  min-width: 24px !important;
  width: 24px !important;
  height: 24px !important;
}

.call-btn:hover {
  opacity: 1;
  transform: scale(1.1);
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
