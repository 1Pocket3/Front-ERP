<script setup lang="ts">
import { defineAsyncComponent, onMounted, onUnmounted } from 'vue';
import { useI18n } from "vue-i18n";
import { useCustomizerStore } from "@/stores/customizer";
import { useLeadsStore } from "@/stores/leads/leads";
import { useLeadsData } from '@/composables/useLeadsData';
import { generateExportFilename } from '@/utils/leadsHelpers';
import axios from "@/utils/axios";

// Lazy load components
const ColumnMappingDialog = defineAsyncComponent(() => import("@/components/import/ColumnMappingDialog.vue"));
const LeadsFilters = defineAsyncComponent(() => import("@/components/leads/LeadsFilters.vue"));
const LeadsActions = defineAsyncComponent(() => import("@/components/leads/LeadsActions.vue"));
const LeadsTable = defineAsyncComponent(() => import("@/components/leads/LeadsTable.vue"));

const { t } = useI18n();
const customizer = useCustomizerStore();
const store = useLeadsStore();

// Use composable for all leads logic
const {
  // State
  leads,
  loading,
  error,
  filters,
  pagination,
  itemsPerPage,
  pageCount,
  totalCount,
  selectedRows,
  bulkAssignUserId,
  bulkStatusValue,
  currentImportId,
  uploadedFile,
  dialogDelete,
  dialogImport,
  dialogColumnMapping,
  selectedLeadId,
  allUsers,
  availableCampaigns,
  dataReadyForTable,
  
  // Computed
  isAdmin,
  isManager,
  
  // Methods
  fetchLeads,
  handleSearch,
  applyFilters,
  clearFilters,
  handlePageChange,
  handleItemsPerPageChange,
  getVisiblePages,
  deleteLead,
  assignLeadToUser,
  bulkApplyChanges,
  makeCall,
  handleFileUpload,
  handleImportCompleted,
  fetchAllUsers,
  fetchExportFilters,
  cleanup,
} = useLeadsData();

const typeAlert = ref("success");

/**
 * Экспорт лидов в CSV или Excel
 */
const exportLeads = async (format: 'csv' | 'excel' = 'csv') => {
  try {
    const exportData: any = {
      format: format
    };
    
    if (filters.value.search) exportData.search = filters.value.search;
    if (isAdmin.value && filters.value.managerFilter) exportData.manager_id = filters.value.managerFilter;
    if (filters.value.statusFilter && filters.value.statusFilter.length) {
      exportData.statuses = filters.value.statusFilter;
    }
    if (filters.value.campaignFilter && filters.value.campaignFilter.length) {
      exportData.campaigns = filters.value.campaignFilter;
    }
    if (filters.value.assignedFilter !== 'any') {
      exportData.assigned = filters.value.assignedFilter === 'assigned' ? true : false;
    }

    const response = await axios.post('leads/leads/export/', exportData, {
      responseType: 'blob'
    });

    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = downloadUrl;
    
    const contentDisposition = response.headers['content-disposition'];
    let filename = generateExportFilename(format, filters.value.statusFilter, filters.value.campaignFilter);
    
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

/**
 * Обработчики действий
 */
const handleRefresh = () => {
  store.clearCache();
  fetchLeads(true);
};

const handleImportClick = () => {
  dialogImport.value = true;
};

const handleAddLead = () => {
  navigateTo('/add-lead');
};

const handleClearSearch = () => {
  filters.value.search = '';
  fetchLeads(true);
};

/**
 * Инициализация при монтировании
 */
onMounted(async () => {
  try {
    console.log('📋 Leads page: Loading leads... (isAdmin:', isAdmin.value, ')');
    await fetchLeads();
    
    // Non-critical data loading with lower priority
    if (window.requestIdleCallback) {
      window.requestIdleCallback(async () => {
        if (isAdmin.value) {
          await fetchAllUsers();
        }
        await fetchExportFilters();
      });
    } else {
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
  cleanup();
});
</script>

<template>
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
        v-model="filters.search"
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

    <!-- Filters -->
    <LeadsFilters
      :filters="filters"
      :all-users="allUsers"
      :available-campaigns="availableCampaigns"
      :is-admin="isAdmin"
      :loading="loading"
      @update:search="(v) => filters.search = v"
      @update:manager-filter="(v) => filters.managerFilter = v"
      @update:status-filter="(v) => filters.statusFilter = v"
      @update:campaign-filter="(v) => filters.campaignFilter = v"
      @update:assigned-filter="(v) => filters.assignedFilter = v"
      @search="handleSearch"
      @apply="applyFilters"
    />

    <!-- Actions -->
    <LeadsActions
      :is-admin="isAdmin"
      :loading="loading"
      @refresh="handleRefresh"
      @import="handleImportClick"
      @add-lead="handleAddLead"
      @export-csv="() => exportLeads('csv')"
      @export-excel="() => exportLeads('excel')"
      @clear="clearFilters"
    />
  </div>

  <!-- Search Info -->
  <v-card v-if="filters.search" elevation="0" class="mb-4 lead-card">
    <v-card-text class="py-3">
      <div class="d-flex justify-space-between align-center">
        <div class="text-body-2 text-medium-emphasis">
          {{ t('search_leads') }}: "{{ filters.search }}" - {{ totalCount }} {{ t('results') }}
        </div>
        <v-btn
          color="primary"
          variant="outlined"
          size="small"
          @click="handleClearSearch"
        >
          {{ t('refresh') }}
        </v-btn>
      </div>
    </v-card-text>
  </v-card>

  <!-- Table -->
  <LeadsTable
    :items="dataReadyForTable"
    :loading="loading"
    :selected-rows="selectedRows"
    :all-users="allUsers"
    :is-admin="isAdmin"
    :is-manager="isManager"
    :bulk-assign-user-id="bulkAssignUserId"
    :bulk-status-value="bulkStatusValue"
    :total-count="totalCount"
    :search-query="filters.search"
    @update:selected-rows="(v) => selectedRows = v"
    @update:bulk-assign-user-id="(v) => bulkAssignUserId = v"
    @update:bulk-status-value="(v) => bulkStatusValue = v"
    @assign-lead="assignLeadToUser"
    @make-call="makeCall"
    @bulk-apply="bulkApplyChanges"
    @clear-search="handleClearSearch"
  />

  <!-- Custom Pagination Footer -->
  <v-card elevation="0" class="lead-card">
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
.filters-container {
  .search-section {
    .search-field {
      width: 50%;
    }
  }
}

.min-width-40 {
  min-width: 40px !important;
}

@media (max-width: 768px) {
  .filters-container {
    .search-section {
      .search-field {
        width: 100%;
      }
    }
  }
}
</style>

