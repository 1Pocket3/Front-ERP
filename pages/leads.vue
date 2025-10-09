<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, defineAsyncComponent } from "vue";
import type { ComputedRef } from "vue";
// Иконки теперь используются через mdi
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth/auth";
import { useCustomizerStore } from "@/stores/customizer";
import { useLeadsStore, type Lead } from "@/stores/leads/leads";
import axios from "@/utils/axios";

// Lazy load heavy components
const ColumnMappingDialog = defineAsyncComponent(() => import("@/components/import/ColumnMappingDialog.vue"));

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
  last_note_date?: string;
}

const { t } = useI18n();
const authStore = useAuthStore();
const customizer = useCustomizerStore();
const store = useLeadsStore();

// Функция форматирования даты
const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};

// Computed свойства
const isAdmin = computed(() => authStore.getIsAdmin);
const isManager = computed(() => authStore.getCurrentUser?.role === 'manager');
const leads = ref<RowItem[]>([]);
const typeAlert = ref("success");

const loading = ref(false);
const dialogDelete = ref(false);
const dialogImport = ref(false);
const dialogColumnMapping = ref(false);
const selectedLeadId = ref<number | null>(null);
const dataReadyForTable = ref<RowItem[]>([]);
const error = ref<string | null>(null);

// Import state
const currentImportId = ref<number | null>(null);
const uploadedFile = ref<File | null>(null);

const pagination = ref(1);
const itemsPerPage = ref(20);
const pageCount = ref(1);
const searchQuery = ref("");
const totalCount = ref(0);
let searchTimeout: ReturnType<typeof setTimeout> | null = null;
const isFetching = ref(false);
const allUsers = ref<any[]>([]);
const availableCampaigns = ref<string[]>([]);

// Filters
const managerFilter = ref<number | null>(null);
const statusFilter = ref<string[]>([]);
const campaignFilter = ref<string[]>([]);
const assignedFilter = ref<'any' | 'assigned' | 'unassigned'>('any');

// Bulk assign
const selectedRows = ref<RowItem[]>([]);
const bulkAssignUserId = ref<number | null>(null);
const bulkStatusValue = ref<string | null>(null);

// Status options for bulk update
const statusOptions = [
  { text: "New", value: "New" },
  { text: "Ftd", value: "Ftd" },
  { text: "Ftd Na", value: "Ftd Na" },
  { text: "No answer", value: "No answer" },
  { text: "Call again", value: "Call again" },
  { text: "Money Call", value: "Money Call" },
  { text: "Awaiting Deposit", value: "Awaiting Deposit" },
  { text: "Kachin Kachin", value: "Kachin Kachin" },
  { text: "Not interested", value: "Not interested" },
  { text: "Reassign", value: "Reassign" },
  { text: "Risk", value: "Risk" },
  { text: "Number not in service", value: "Number not in service" },
  { text: "Different Person", value: "Different Person" },
  { text: "Wrong number", value: "Wrong number" },
  { text: "No Language", value: "No Language" },
];

const headers: ComputedRef = computed(() => [
  { title: "ID", align: "start", key: "id", sortable: true },
  { title: t("full_name"), align: "start", key: "full_name", sortable: true },
  { title: t("phone"), align: "start", key: "phone", sortable: true },
  { title: t("email"), align: "start", key: "email", sortable: true },
  { title: t("company"), align: "start", key: "company", sortable: true },
  { title: t("lead_source"), align: "start", key: "lead_source", sortable: true },
  { title: 'Status', align: 'start', key: 'status', sortable: true },
  { title: t("assigned_to"), align: "start", key: "assigned_to", sortable: true },
  // { title: t("uploaded_by"), align: "start", key: "uploaded_by", sortable: true },
  { title: t("created_at"), align: "start", key: "created_at", sortable: true },
  { title: "Last Note", align: "start", key: "last_note_date", sortable: true },
  // { title: 'Campaign', align: "start", key: "campaign", sortable: true },
]);

const fetchLeads = async (skipCache = false) => {
  // Если уже идет загрузка и это не принудительное обновление, выходим
  if (isFetching.value && !skipCache) {
    console.log('Fetching already in progress, skipping...');
    return;
  }
  
  isFetching.value = true;
  loading.value = true;
  error.value = null;
  
  try {
    await store.fetchLeads({
      search: searchQuery.value,
      manager_id: isAdmin.value && managerFilter.value ? managerFilter.value : undefined,
      status: statusFilter.value && statusFilter.value.length ? statusFilter.value : undefined,
      campaign: campaignFilter.value && campaignFilter.value.length ? campaignFilter.value : undefined,
      assigned: assignedFilter.value === 'any' ? undefined : assignedFilter.value === 'assigned',
      page: pagination.value,
      page_size: itemsPerPage.value,
      skipCache: skipCache, // Пропускаем кэш при принудительном обновлении
    });
    leads.value = store.getLeads.map(formatLeadData);
    processLeads();
  } catch (err) {
    console.error("Error fetching leads:", err);
    error.value = err instanceof Error ? err.message : 'Ошибка загрузки данных';
    customizer.toggleAlertVisibility('error', 'Failed to load leads');
  } finally {
    loading.value = false;
    isFetching.value = false;
  }
};

const formatLeadData = (lead: Lead): RowItem => {
  const createdDate = new Date(lead.created_at);
  const updatedDate = new Date(lead.updated_at);

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
    last_note_date: lead.last_note_date ? formatDate(new Date(lead.last_note_date)) : '—',
  };
};

const processLeads = () => {
  dataReadyForTable.value = leads.value;
  pageCount.value = store.getTotalPages;
  totalCount.value = store.getTotalCount;
};

const deleteLead = async () => {
  if (!selectedLeadId.value) return;
  
  try {
    await store.deleteLead(selectedLeadId.value);
    customizer.toggleAlertVisibility('success', 'Lead deleted successfully');
    await fetchLeads(true); // Принудительное обновление после удаления
    dialogDelete.value = false;
    selectedLeadId.value = null;
  } catch (error) {
    console.error("Error deleting lead:", error);
    customizer.toggleAlertVisibility('error', 'Failed to delete lead');
  }
};

const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  searchTimeout = setTimeout(() => {
    pagination.value = 1;
    fetchLeads(true); // Принудительное обновление при поиске
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
    // Загружаем файл
    const response = await store.uploadFile(file);
    currentImportId.value = response.data.id;
    uploadedFile.value = file;
    
    // Закрываем диалог импорта и открываем диалог маппинга
    dialogImport.value = false;
    dialogColumnMapping.value = true;
    
  } catch (error) {
    console.error("Error uploading file:", error);
    customizer.toggleAlertVisibility('error', 'Failed to upload file');
  }
};

const handleImportCompleted = async () => {
  // Сбрасываем состояние
  currentImportId.value = null;
  uploadedFile.value = null;
  
  // Показываем сообщение об успехе
  customizer.toggleAlertVisibility('success', 'Import completed successfully');
  
  // Очищаем весь кэш перед обновлением
  store.clearCache();
  
  // Сбрасываем на первую страницу
  pagination.value = 1;
  
  // Даем серверу время на обработку импорта
  setTimeout(async () => {
    await fetchLeads(true); // Принудительное обновление с пропуском кэша
  }, 1000); // Увеличили задержку до 1 секунды
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
  fetchLeads(true); // Принудительное обновление при применении фильтров
};

const clearFilters = () => {
  managerFilter.value = null;
  statusFilter.value = [];
  campaignFilter.value = [];
  assignedFilter.value = 'any';
  pagination.value = 1;
  fetchLeads(true); // Принудительное обновление при очистке фильтров
};

const bulkApplyChanges = async () => {
  // if (!isAdmin.value || selectedRows.value.length === 0) return;
  if (bulkAssignUserId.value === null && !bulkStatusValue.value) return;
  
  const leadIds = selectedRows.value.map(r => r.id);
  const operations = [];
  
  try {
    // Выполняем назначение менеджера, если выбрано
    if (bulkAssignUserId.value !== null) {
      operations.push('assign');
      await store.assignLeads(leadIds, bulkAssignUserId.value);
    }
    
    // Выполняем изменение статуса, если выбрано
    if (isManager.value || isAdmin.value) {
      if (bulkStatusValue.value) {
          operations.push('status');
          await store.updateLeadStatus(leadIds, bulkStatusValue.value);
        }
    }
    
    // Формируем сообщение об успехе
    let successMessage = '';
    if (operations.includes('assign') && operations.includes('status')) {
      successMessage = 'Leads assigned and status changed successfully';
    } else if (operations.includes('assign')) {
      successMessage = 'Leads assigned successfully';
    } else if (operations.includes('status')) {
      successMessage = 'Leads status changed successfully';
    }
    
    customizer.toggleAlertVisibility('success', successMessage);
    
    // Очищаем форму
    selectedRows.value = [];
    bulkAssignUserId.value = null;
    bulkStatusValue.value = null;
    
    await fetchLeads(true); // Принудительное обновление после массовых изменений
  } catch (error) {
    console.error('Error applying bulk changes:', error);
    customizer.toggleAlertVisibility('error', 'Failed to apply changes');
  }
};

const assignLeadToUser = async (leadId: number, userId: number | null) => {
  try {
    await store.assignLeads([leadId], userId);
    customizer.toggleAlertVisibility('success', 'Lead assigned successfully');
    await fetchLeads(true); // Принудительное обновление после назначения
  } catch (error) {
    console.error("Error assigning lead:", error);
    customizer.toggleAlertVisibility('error', 'Failed to assign lead');
  }
};

const makeCall = async (leadId: number) => {
   try {
    // Устанавливаем состояние загрузки для конкретного лида
    authStore.setCallingState(true, leadId);
    
    const billId = authStore.currentUser?.phone_extension;
    const result = await store.initiateCall(leadId, billId);
    
    // Показываем сообщение из ответа API
    const message = result?.message || 'Call initiated successfully';
    customizer.toggleAlertVisibility('success', message);
   } catch (error: any) {
     console.error('Error making call:', error);
     customizer.toggleAlertVisibility('error', error.response.data.error);
   } finally {
     // Сбрасываем состояние загрузки
     authStore.setCallingState(false, null);
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

const fetchExportFilters = async () => {
  try {
    const response = await axios.get('leads/leads/export/filters/');
    const filters = response.data;
    availableCampaigns.value = filters.campaigns || [];
  } catch (error) {
    console.error('Error fetching export filters:', error);
  }
};

const exportLeads = async (format: 'csv' | 'excel' = 'csv') => {
  try {
    // Подготавливаем данные для POST запроса
    const exportData: any = {
      format: format
    };
    
    if (searchQuery.value) exportData.search = searchQuery.value;
    if (isAdmin.value && managerFilter.value) exportData.manager_id = managerFilter.value;
    if (statusFilter.value && statusFilter.value.length) {
      exportData.statuses = statusFilter.value;
    }
    if (campaignFilter.value && campaignFilter.value.length) {
      exportData.campaigns = campaignFilter.value;
    }
    if (assignedFilter.value !== 'any') {
      exportData.assigned = assignedFilter.value === 'assigned' ? true : false;
    }

    const response = await axios.post('leads/leads/export/', exportData, {
      responseType: 'blob'
    });

    // Создаем ссылку для скачивания файла
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = downloadUrl;
    
    // Определяем имя файла из заголовка Content-Disposition или создаем по умолчанию
    const contentDisposition = response.headers['content-disposition'];
    // Генерируем имя файла с датой и фильтрами
    const today = new Date().toISOString().split('T')[0];
    const statusPart = statusFilter.value.length ? statusFilter.value.join(',') : 'all';
    const campaignPart = campaignFilter.value.length ? campaignFilter.value.join(',') : 'all';
    const extension = format === 'excel' ? 'xlsx' : 'csv';
    
    let filename = `leads_export_${today}_${statusPart}_${campaignPart}.${extension}`;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
    
    customizer.toggleAlertVisibility('success', `Leads exported successfully as ${format.toUpperCase()}`);
  } catch (error) {
    console.error('Error exporting leads:', error);
    customizer.toggleAlertVisibility('error', 'Failed to export leads');
  }
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
    case 'Reassign':
      return 'secondary';
    case 'Risk':
      return 'error';
    case 'Number not in service':
      return 'warning';
    case 'Different Person':
      return 'info';
    case 'Wrong number':
      return 'warning';
    case 'No Language':
      return 'info';
    default:
      return 'secondary';
  }
};

onMounted(async () => {
  try {
    // Layout уже загрузил данные пользователя, можем сразу загружать лиды
    console.log('📋 Leads page: Loading leads... (isAdmin:', isAdmin.value, ')');
    await fetchLeads();
    
    // Шаг 3: Non-critical data loading with lower priority
    if (window.requestIdleCallback) {
      window.requestIdleCallback(async () => {
        // Загружаем список пользователей только для админов
        if (isAdmin.value) {
          await fetchAllUsers();
        }
        
        // Загружаем доступные кампании для фильтра
        await fetchExportFilters();
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      if (isAdmin.value) {
        await fetchAllUsers();
      }
      await fetchExportFilters();
    }
  } catch (err) {
    console.error('Error during page initialization:', err);
    error.value = 'Failed to initialize page';
  }
});

onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
});
</script>

<template>
  <!-- <LazyBaseBreadcrumb :project-title="'Лиды'" /> -->
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

  <div class="filters-container py-4 lead-card">
    <!-- Search Section -->
    <div class="search-section mb-4">
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

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="filters-row">
        <!-- Manager filter (admin only) -->
        <v-select
          v-if="isAdmin"
          :items="allUsers.map((user: any) => ({ ...user, display_name: getUserDisplayName(user) }))"
          item-title="display_name"
          item-value="id"
          density="compact"
          variant="outlined"
          hide-details
          clearable
          class="filter-item manager-filter"
          :label="t('assigned_to')"
          v-model="managerFilter"
          @update:model-value="applyFilters"
        />

        <!-- Status filter (multi) -->
        <v-select
          :items="['New','Ftd','Ftd Na','No answer','Call again','Money Call','Awaiting Deposit','Kachin Kachin','Not interested','Reassign','Risk','Number not in service','Different Person','Wrong number','No Language']"
          multiple
          density="compact"
          variant="outlined"
          hide-details
          clearable
          class="filter-item status-filter"
          label="Status"
          v-model="statusFilter"
          @update:model-value="applyFilters"
        />

        <!-- Campaign filter (multi) -->
        <v-select
          v-if="isAdmin"
          :items="availableCampaigns"
          multiple
          density="compact"
          variant="outlined"
          hide-details
          clearable
          class="filter-item campaign-filter"
          label="Campaign"
          v-model="campaignFilter"
          @update:model-value="applyFilters"
        />

        <!-- Assigned filter -->
        <v-select
          v-if="isAdmin"
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
          class="filter-item assigned-filter"
          v-model="assignedFilter"
          @update:model-value="applyFilters"
        />
      </div>

      <!-- Action Buttons Section -->
      <div class="actions-section">
        <div class="actions-row">
          <v-btn
            color="info"
            variant="outlined"
            @click="() => { store.clearCache(); fetchLeads(true); }"
            :loading="loading"
            :disabled="loading"
            class="action-btn"
            size="small"
          >
            <v-icon size="small">mdi-refresh</v-icon>
            <span class="btn-text">{{ loading ? 'Loading...' : 'Refresh' }}</span>
          </v-btn>
          
          <v-btn
            v-if="isAdmin"
            color="primary"
            variant="outlined"
            @click="handleImport"
            class="action-btn"
            size="small"
          >
            <v-icon size="16" class="btn-icon">mdi-upload</v-icon>
            <span class="btn-text">{{ t('import_leads') }}</span>
          </v-btn>
          
          <v-btn
            v-if="isAdmin"
            color="primary"
            variant="flat"
            @click="navigateTo('/add-lead')"
            class="action-btn"
            size="small"
          >
            <v-icon size="16" class="btn-icon">mdi-plus</v-icon>
            <span class="btn-text">{{ t('add_lead') }}</span>
          </v-btn>
          
          <v-btn
            v-if="isAdmin"
            color="success"
            variant="outlined"
            @click="exportLeads('csv')"
            class="action-btn"
            size="small"
          >
            <v-icon size="small">mdi-file-export</v-icon>
            <span class="btn-text">Export CSV</span>
          </v-btn>
          
          <v-btn
            v-if="isAdmin"
            color="success"
            variant="outlined"
            @click="exportLeads('excel')"
            class="action-btn"
            size="small"
          >
            <v-icon size="small">mdi-file-excel</v-icon>
            <span class="btn-text">Export Excel</span>
          </v-btn>
          
          <v-btn
            variant="text"
            @click="clearFilters"
            class="action-btn"
            size="small"
          >
            <span class="btn-text">{{ t('clear') }}</span>
          </v-btn>
        </div>
      </div>
    </div>
  </div>


  <!-- Search Info -->
  <v-card v-if="searchQuery" elevation="0" class="mb-4 lead-card">
    <v-card-text class="py-3">
      <div class="d-flex justify-space-between align-center">
        <div class="text-body-2 text-medium-emphasis">
          {{ t('search_leads') }}: "{{ searchQuery }}" - {{ totalCount }} {{ t('results') }}
        </div>
        <v-btn
          color="primary"
          variant="outlined"
          size="small"
          @click="searchQuery = ''; fetchLeads(true)"
        >
          {{ t('refresh') }}
        </v-btn>
      </div>
    </v-card-text>
  </v-card>

  <v-card elevation="0" class="lead-card">
    <!-- Loading Progress Bar -->
    <!-- <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      height="4"
      class="loading-bar"
    /> -->

    <v-data-table
      :items-per-page="-1"
      :page="1"
      :headers="headers"
      item-key="id"
      :items="dataReadyForTable"
      :return-object="true"
      v-model="selectedRows"
      show-select
      :class="['border rounded-md table-hover leads-table', { 'table-loading': loading }]"
      :loading="loading"
      hide-default-footer
    >
      

      <!-- Bulk actions toolbar -->
      <template v-slot:top>
        <div v-if="selectedRows.length" class="px-4 py-2">
          <div class="d-flex align-center gap-3 flex-wrap">
            <div class="text-body-2">{{ t('selected') }}: {{ selectedRows.length }}</div>
            
            <!-- Assign Manager Section -->
            <v-select
              v-if="isAdmin"
              :items="allUsers.map((user: any) => ({ ...user, display_name: getUserDisplayName(user) }))"
              item-title="display_name"
              item-value="id"
              density="compact"
              variant="outlined"
              hide-details
              style="min-width: 220px;"
              :label="t('assign_manager')"
              v-model="bulkAssignUserId"
            />
            
            <!-- Change Status Section -->
            <v-select
              v-if="isManager || isAdmin"
              :items="statusOptions"
              item-title="text"
              item-value="value"
              density="compact"
              variant="outlined"
              hide-details
              style="min-width: 180px;"
              :label="t('change_status')"
              v-model="bulkStatusValue"
            />
            
            <!-- Apply Changes Button -->
            <v-btn 
              color="primary" 
              variant="flat" 
              :disabled="bulkAssignUserId===null && !bulkStatusValue" 
              @click="bulkApplyChanges"
            >
              {{ t('apply_changes') }}
            </v-btn>
            
            <!-- Cancel Button -->
            <v-btn color="error" variant="outlined" @click="() => { bulkAssignUserId = null; bulkStatusValue = null; selectedRows = []; }">
              {{ t('cancel') }}
            </v-btn>
          </div>
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
            @click="searchQuery = ''; fetchLeads(true)"
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
            :color="authStore.callingLeadId === item.id ? 'success' : authStore.isCalling && authStore.callingLeadId !== item.id ? 'error' : 'success'"
            :loading="authStore.callingLeadId === item.id"
            :disabled="authStore.isCalling"
            @click.stop="makeCall(item.id)"
            class="call-btn call-button"
          >
            <v-icon size="small">mdi-phone</v-icon>
            <v-tooltip activator="parent" location="top">
              {{ authStore.callingLeadId === item.id ? t('calling') : authStore.isCalling && authStore.callingLeadId !== item.id ? t('call_in_progress') : t('call') }}
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
        <v-chip :color="getStatusColor(item.status)" size="small" variant="outlined" :class="`status-${item.status.toLowerCase().replace(/\s+/g, '-')}`">
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
            :items="allUsers.map((user: any) => ({ ...user, display_name: getUserDisplayName(user) }))"
            item-title="display_name"
            item-value="id"
            density="compact"
            variant="outlined"
            hide-details
            :placeholder="t('assign_manager')"
            class="assign-select"
            @update:model-value="(userId: any) => assignLeadToUser(item.id, userId)"
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
      <!-- <template v-slot:item.uploaded_by="{ item }">
        <v-chip color="secondary" size="small" class="text-body-2">
          {{ `${item.uploaded_by.first_name || item.uploaded_by.username} ${item.uploaded_by.last_name || ''}` }}
        </v-chip>
      </template> -->

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

  <!-- Column Mapping Dialog -->
  <ColumnMappingDialog
    v-model="dialogColumnMapping"
    :import-id="currentImportId || undefined"
    @import-completed="handleImportCompleted"
  />
</template>

<style scoped lang="scss">
// Loading bar
.loading-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

// Table loading state
.table-loading {
  opacity: 0.6;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

// Filters Container
.filters-container {
  .search-section {
    .search-field {
      width: 50%;
    }
  }

  .filters-section {
    .filters-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 16px;

      .filter-item {
        flex: 1;
        min-width: 200px;
        
        &.manager-filter {
          min-width: 180px;
        }
        
        &.status-filter {
          min-width: 220px;
        }
        
        &.campaign-filter {
          min-width: 200px;
        }
        
        &.assigned-filter {
          min-width: 160px;
        }
      }
    }

    .actions-section {
      .actions-row {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        justify-content: flex-start;

        .action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;

          .btn-icon {
            flex-shrink: 0;
          }

          .btn-text {
            display: inline;
          }
        }
      }
    }
  }
}

// Table styles
.table-hover tr:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.table-row {
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: rgba(var(--v-theme-primary), 0.08) !important;
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

.call-btn.v-btn--disabled {
  opacity: 0.6 !important;
  cursor: not-allowed !important;
}

.call-btn.v-btn--disabled:hover {
  transform: none !important;
}

// Responsive breakpoints
@media (max-width: 1200px) {
  .filters-container .filters-section .filters-row {
    .filter-item {
      min-width: 180px;
      
      &.status-filter {
        min-width: 200px;
      }
      
      &.campaign-filter {
        min-width: 180px;
      }
    }
  }
}

@media (max-width: 992px) {
  .filters-container .filters-section .filters-row {
    .filter-item {
      min-width: 160px;
      
      &.status-filter {
        min-width: 180px;
      }
      
      &.campaign-filter {
        min-width: 160px;
      }
    }
  }
}

@media (max-width: 768px) {
  .filters-container {
    .search-section {
      .search-field {
        width: 100%;
      }
    }
    
    .filters-section {
      .filters-row {
        flex-direction: column;
        gap: 8px;

        .filter-item {
          min-width: 100%;
          width: 100%;
        }
      }

      .actions-section .actions-row {
        justify-content: center;
        gap: 8px;

        .action-btn {
          flex: 1;
          min-width: 0;
          min-height: 44px !important;
          height: 44px !important;
          padding: 10px 16px !important;
          
          .btn-text {
            font-size: 0.875rem;
            display: inline !important;
          }
        }
      }
    }
  }
}

@media (max-width: 576px) {
  .filters-container {
    .filters-section {
      .actions-section .actions-row {
        flex-direction: column;
        gap: 12px;

        .action-btn {
          width: 100%;
          justify-content: center;
          min-height: 48px !important;
          height: 48px !important;
          padding: 12px 20px !important;
          
          .btn-text {
            font-size: 0.9rem;
            display: inline !important;
            font-weight: 500;
          }
        }
      }
    }
  }
}

@media (max-width: 400px) {
  .filters-container {
    .filters-section {
      .actions-section .actions-row {
        gap: 10px;
        
        .action-btn {
          min-height: 44px !important;
          height: 44px !important;
          padding: 10px !important;
          
          .btn-text {
            display: none;
          }
          
          .btn-icon,
          .v-icon {
            margin: 0 !important;
            font-size: 20px !important;
          }
        }
      }
    }
  }
}
</style>
