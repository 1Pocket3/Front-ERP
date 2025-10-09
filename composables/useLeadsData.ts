import { ref, computed } from 'vue';
import { useLeadsStore, type Lead } from '@/stores/leads/leads';
import { useAuthStore } from '@/stores/auth/auth';
import { useCustomizerStore } from '@/stores/customizer';
import type { LeadRow, LeadFilters } from '@/types/leads';
import { formatDate } from '@/utils/leadsHelpers';

export const useLeadsData = () => {
  const store = useLeadsStore();
  const authStore = useAuthStore();
  const customizer = useCustomizerStore();

  // State
  const leads = ref<LeadRow[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const isFetching = ref(false);
  
  // Pagination
  const pagination = ref(1);
  const itemsPerPage = ref(20);
  const pageCount = ref(1);
  const totalCount = ref(0);
  
  // Filters
  const filters = ref<LeadFilters>({
    search: '',
    managerFilter: null,
    statusFilter: [],
    campaignFilter: [],
    assignedFilter: 'any',
  });
  
  // Search
  let searchTimeout: ReturnType<typeof setTimeout> | null = null;
  
  // Selection and bulk operations
  const selectedRows = ref<LeadRow[]>([]);
  const bulkAssignUserId = ref<number | null>(null);
  const bulkStatusValue = ref<string | null>(null);
  
  // Import
  const currentImportId = ref<number | null>(null);
  const uploadedFile = ref<File | null>(null);
  
  // Dialogs
  const dialogDelete = ref(false);
  const dialogImport = ref(false);
  const dialogColumnMapping = ref(false);
  const selectedLeadId = ref<number | null>(null);
  
  // Users and campaigns
  const allUsers = ref<any[]>([]);
  const availableCampaigns = ref<string[]>([]);
  
  // Computed
  const isAdmin = computed(() => authStore.getIsAdmin);
  const isManager = computed(() => authStore.getCurrentUser?.role === 'manager');
  const dataReadyForTable = computed(() => leads.value);

  /**
   * Форматирует данные лида для таблицы
   */
  const formatLeadData = (lead: Lead): LeadRow => {
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

  /**
   * Обрабатывает данные лидов после получения
   */
  const processLeads = () => {
    pageCount.value = store.getTotalPages;
    totalCount.value = store.getTotalCount;
  };

  /**
   * Загружает лиды с сервера
   */
  const fetchLeads = async (skipCache = false) => {
    if (isFetching.value && !skipCache) {
      console.log('Fetching already in progress, skipping...');
      return;
    }
    
    isFetching.value = true;
    loading.value = true;
    error.value = null;
    
    try {
      await store.fetchLeads({
        search: filters.value.search,
        manager_id: isAdmin.value && filters.value.managerFilter ? filters.value.managerFilter : undefined,
        status: filters.value.statusFilter && filters.value.statusFilter.length ? filters.value.statusFilter : undefined,
        campaign: filters.value.campaignFilter && filters.value.campaignFilter.length ? filters.value.campaignFilter : undefined,
        assigned: filters.value.assignedFilter === 'any' ? undefined : filters.value.assignedFilter === 'assigned',
        page: pagination.value,
        page_size: itemsPerPage.value,
        skipCache: skipCache,
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

  /**
   * Обработка поиска с задержкой
   */
  const handleSearch = () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    searchTimeout = setTimeout(() => {
      pagination.value = 1;
      fetchLeads(true);
    }, 500);
  };

  /**
   * Применение фильтров
   */
  const applyFilters = () => {
    pagination.value = 1;
    fetchLeads(true);
  };

  /**
   * Очистка фильтров
   */
  const clearFilters = () => {
    filters.value = {
      search: '',
      managerFilter: null,
      statusFilter: [],
      campaignFilter: [],
      assignedFilter: 'any',
    };
    pagination.value = 1;
    fetchLeads(true);
  };

  /**
   * Изменение страницы
   */
  const handlePageChange = (page: number) => {
    pagination.value = page;
    fetchLeads();
  };

  /**
   * Изменение количества элементов на странице
   */
  const handleItemsPerPageChange = (itemsPerPageValue: number) => {
    itemsPerPage.value = itemsPerPageValue;
    pagination.value = 1;
    fetchLeads();
  };

  /**
   * Получение видимых страниц для пагинации
   */
  const getVisiblePages = () => {
    const current = pagination.value;
    const total = pageCount.value;
    const delta = 2;
    
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

  /**
   * Удаление лида
   */
  const deleteLead = async () => {
    if (!selectedLeadId.value) return;
    
    try {
      await store.deleteLead(selectedLeadId.value);
      customizer.toggleAlertVisibility('success', 'Lead deleted successfully');
      await fetchLeads(true);
      dialogDelete.value = false;
      selectedLeadId.value = null;
    } catch (error) {
      console.error("Error deleting lead:", error);
      customizer.toggleAlertVisibility('error', 'Failed to delete lead');
    }
  };

  /**
   * Назначение лида пользователю
   */
  const assignLeadToUser = async (leadId: number, userId: number | null) => {
    try {
      await store.assignLeads([leadId], userId);
      customizer.toggleAlertVisibility('success', 'Lead assigned successfully');
      await fetchLeads(true);
    } catch (error) {
      console.error("Error assigning lead:", error);
      customizer.toggleAlertVisibility('error', 'Failed to assign lead');
    }
  };

  /**
   * Массовое применение изменений
   */
  const bulkApplyChanges = async () => {
    if (selectedRows.value.length === 0) return;
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
      
      await fetchLeads(true);
    } catch (error) {
      console.error('Error applying bulk changes:', error);
      customizer.toggleAlertVisibility('error', 'Failed to apply changes');
    }
  };

  /**
   * Инициирование звонка
   */
  const makeCall = async (leadId: number) => {
    try {
      authStore.setCallingState(true, leadId);
      
      const billId = authStore.currentUser?.phone_extension;
      const result = await store.initiateCall(leadId, billId);
      
      const message = result?.message || 'Call initiated successfully';
      customizer.toggleAlertVisibility('success', message);
    } catch (error: any) {
      console.error('Error making call:', error);
      customizer.toggleAlertVisibility('error', error.response?.data?.error || 'Failed to initiate call');
    } finally {
      authStore.setCallingState(false, null);
    }
  };

  /**
   * Загрузка файла для импорта
   */
  const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (!file) return;

    try {
      const response = await store.uploadFile(file);
      currentImportId.value = response.data.id;
      uploadedFile.value = file;
      
      dialogImport.value = false;
      dialogColumnMapping.value = true;
    } catch (error) {
      console.error("Error uploading file:", error);
      customizer.toggleAlertVisibility('error', 'Failed to upload file');
    }
  };

  /**
   * Завершение импорта
   */
  const handleImportCompleted = async () => {
    currentImportId.value = null;
    uploadedFile.value = null;
    
    customizer.toggleAlertVisibility('success', 'Import completed successfully');
    
    store.clearCache();
    pagination.value = 1;
    
    setTimeout(async () => {
      await fetchLeads(true);
    }, 1000);
  };

  /**
   * Загрузка всех пользователей
   */
  const fetchAllUsers = async () => {
    try {
      allUsers.value = await store.getAllUsers();
    } catch (error) {
      console.error('Error fetching all users:', error);
    }
  };

  /**
   * Загрузка доступных кампаний
   */
  const fetchExportFilters = async () => {
    try {
      const response = await store.getExportFilters();
      availableCampaigns.value = response.campaigns || [];
    } catch (error) {
      console.error('Error fetching export filters:', error);
    }
  };

  /**
   * Очистка таймаута поиска
   */
  const cleanup = () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
  };

  return {
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
  };
};

