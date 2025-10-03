<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useLeadsStore, type Lead } from "@/stores/leads/leads";
import { useCustomizerStore } from "@/stores/customizer";
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
import CommentsSection from "@/components/comments/CommentsSection.vue";
import { PencilIcon, TrashIcon, PhoneIcon } from "vue-tabler-icons";

const { t } = useI18n();
const store = useLeadsStore();
const customizer = useCustomizerStore();

const route = useRoute();
const leadId = parseInt(route.params.id as string);

const loading = ref(false);
const typeAlert = ref("success");
const lead = ref<Lead | null>(null);
const dialogDelete = ref(false);

// Новые переменные для назначения менеджера
const allUsers = ref<any[]>([]);
const isAdmin = ref(false);
const isAssigning = ref(false);
const isUpdatingStatus = ref(false);
const allStatuses = [
  'New',
  'Ftd',
  'Ftd Na',
  'No answer',
  'Call again',
  'Money Call',
  'Awaiting Deposit',
  'Kachin Kachin',
  'Not interested',
  'Reassign',
  'Risk',
  'Number not in service',
  'Different Person',
  'Wrong number',
  'No Language',
];

const fetchLead = async () => {
  loading.value = true;
  try {
    lead.value = await store.getLeadById(leadId);
  } catch (error) {
    console.error("Error fetching lead:", error);
    customizer.toggleAlertVisibility();
    typeAlert.value = "error";
  } finally {
    loading.value = false;
  }
};

const fetchAllUsers = async () => {
  try {
    allUsers.value = await store.getAllUsers();
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};


const getUserDisplayName = (user: any) => {
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  return user.username || user.email || 'Unknown';
};

const assignLeadToUser = async (userId: number | null) => {
  if (!lead.value) return;
  
  isAssigning.value = true;
  try {
    await store.assignLeads([lead.value.id], userId);
    
    // Обновляем данные лида
    await fetchLead();
    
    customizer.toggleAlertVisibility();
    typeAlert.value = "success";
  } catch (error) {
    console.error("Error assigning lead:", error);
    customizer.toggleAlertVisibility();
    typeAlert.value = "error";
  } finally {
    isAssigning.value = false;
  }
};

const updateStatus = async (newStatus: string) => {
  if (!lead.value) return;
  isUpdatingStatus.value = true;
  try {
    await store.updateLeadStatus(lead.value.id, newStatus);
    await fetchLead();
    customizer.toggleAlertVisibility();
    typeAlert.value = "success";
  } catch (error) {
    console.error("Error updating status:", error);
    customizer.toggleAlertVisibility();
    typeAlert.value = "error";
  } finally {
    isUpdatingStatus.value = false;
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
    default:
      return 'secondary';
  }
};

const makeCall = async () => {
  if (lead.value?.id) {
    try {
      const result = await store.initiateCall(lead.value.id);
      customizer.toggleAlertVisibility();
      typeAlert.value = "success";
      console.log('Call initiated:', result);
    } catch (error) {
      console.error('Error initiating call:', error);
      customizer.toggleAlertVisibility();
      typeAlert.value = "error";
    }
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

const deleteLead = async () => {
  if (!lead.value) return;
  
  try {
    await store.deleteLead(lead.value.id);
    customizer.toggleAlertVisibility();
    typeAlert.value = "success";
    dialogDelete.value = false;
    await navigateTo('/leads');
  } catch (error) {
    console.error("Error deleting lead:", error);
    customizer.toggleAlertVisibility();
    typeAlert.value = "error";
  }
};

const editLead = () => {
  if (lead.value) {
    navigateTo(`/edit-lead/${lead.value.id}`);
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};



onMounted(async () => {
  await fetchLead();
  
  // Проверяем, есть ли данные пользователя в store
  if (!store.getCurrentUser) {
    try {
      await store.fetchCurrentUser();
    } catch (error) {
      console.error('Could not fetch current user:', error);
    }
  }
  
  // Устанавливаем флаг админа
  isAdmin.value = store.getIsAdmin;
  
  // Загружаем список пользователей только для админов
  if (isAdmin.value) {
    await fetchAllUsers();
  }
  
});
</script>

<template>
  <!-- <BaseBreadcrumb :project-title="lead?.full_name || t('lead')" /> -->
  
  <div class="mt-2 alert-container" v-if="customizer.showAlert">
    <Alerts :t="t" :type="typeAlert" />
  </div>

  <v-card v-if="lead" elevation="0" class="mt-4 lead-card">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h5 lead-name">{{ lead.full_name }}</span>
      <div class="action-buttons">
        <v-btn
          v-if="isAdmin"
          color="primary"
          variant="outlined"
          @click="editLead"
          class="mr-2"
        >
          <PencilIcon stroke-width="1.5" size="20" class="mr-2" />
          {{ t('edit') }}
        </v-btn>
        <v-btn
          v-if="isAdmin"
          color="error"
          variant="outlined"
          @click="dialogDelete = true"
        >
          <TrashIcon stroke-width="1.5" size="20" class="mr-2" />
          {{ t('delete') }}
        </v-btn>
      </div>
    </v-card-title>
    
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <v-card variant="outlined" class="pa-4">
            <h3 class="text-h6 mb-4">{{ t('contact_information') }}</h3>
            
            <div class="info-item mb-3">
              <strong>{{ t('phone') }}:</strong>
              <div v-if="lead.phone" class="d-flex align-center gap-2 ml-2">
                <span class="text-body-2 lead-phone">{{ maskPhoneNumber(lead.phone) }}</span>
                <v-btn
                  icon="mdi-phone"
                  size="small"
                  variant="text"
                  color="success"
                  @click="makeCall"
                  class="call-btn call-button"
                >
                  <v-icon size="small">mdi-phone</v-icon>
                  <v-tooltip activator="parent" location="top">
                    {{ t('call') }}
                  </v-tooltip>
                </v-btn>
              </div>
              <span v-else class="text-grey ml-2">—</span>
            </div>
            
            <div class="info-item mb-3" v-if="lead.email">
              <strong>{{ t('email') }}:</strong>
              <span class="ml-2">{{ lead.email }}</span>
            </div>
            
            <div class="info-item mb-3" v-if="lead.company">
              <strong>{{ t('company') }}:</strong>
              <span class="ml-2">{{ lead.company }}</span>
            </div>
            
            <div class="info-item mb-3" v-if="lead.lead_source">
              <strong>{{ t('lead_source') }}:</strong>
              <span class="ml-2">{{ lead.lead_source }}</span>
            </div>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-card variant="outlined" class="pa-4">
            <h3 class="text-h6 mb-4">{{ t('system_information') }}</h3>
            
            <div class="info-item mb-3">
              <strong>Status:</strong>
              <div class="ml-2" v-if="isAdmin || (lead.assigned_to && store.getCurrentUser && lead.assigned_to.id === store.getCurrentUser.id)">
                <v-select
                  :items="allStatuses"
                  :model-value="lead.status"
                  density="compact"
                  variant="outlined"
                  hide-details
                  class="assign-select"
                  :loading="isUpdatingStatus"
                  @update:model-value="updateStatus"
                >
                  <template #selection="{ item }">
                    <v-chip :color="getStatusColor(item.title)" size="small" variant="outlined">
                      <v-icon start size="x-small" class="mr-1">
                        {{ getStatusColor(item.title) === 'success' ? 'mdi-check' :
                           getStatusColor(item.title) === 'error' ? 'mdi-close' :
                           getStatusColor(item.title) === 'warning' ? 'mdi-alert' :
                           getStatusColor(item.title) === 'info' ? 'mdi-information' :
                           getStatusColor(item.title) === 'primary' ? 'mdi-star' :
                           'mdi-circle-outline' }}
                      </v-icon>
                      {{ item.title }}
                    </v-chip>
                  </template>
                  <template #item="{ item, props }">
                    <v-list-item v-bind="props">
                      <template #title>
                        <v-chip :color="getStatusColor(item.title)" size="small" variant="outlined">
                          {{ item.title }}
                        </v-chip>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </div>
              <div class="ml-2" v-else>
                <v-chip :color="getStatusColor(lead.status)" size="small" variant="outlined" :class="`status-${lead.status.toLowerCase().replace(/\s+/g, '-')}`">
                  <v-icon start size="x-small" class="mr-1">
                    {{ getStatusColor(lead.status) === 'success' ? 'mdi-check' :
                       getStatusColor(lead.status) === 'error' ? 'mdi-close' :
                       getStatusColor(lead.status) === 'warning' ? 'mdi-alert' :
                       getStatusColor(lead.status) === 'info' ? 'mdi-information' :
                       getStatusColor(lead.status) === 'primary' ? 'mdi-star' :
                       'mdi-circle-outline' }}
                  </v-icon>
                  {{ lead.status }}
                </v-chip>
              </div>
            </div>

            <div class="info-item mb-3">
              <strong>{{ t('uploaded_by') }}:</strong>
              <span class="ml-2">
                {{ lead.uploaded_by.first_name }} {{ lead.uploaded_by.last_name }}
                <v-chip size="small" color="secondary" class="ml-2">
                  {{ lead.uploaded_by.role }}
                </v-chip>
              </span>
            </div>
            
            <div class="info-item mb-3">
              <strong>{{ t('assigned_to') }}:</strong>
              <div v-if="isAdmin" class="d-flex align-center mt-2">
                <v-select
                  :items="[
                    { id: null, display_name: 'Remove Assign', role: 'unassign' },
                    ...allUsers.map(user => ({ ...user, display_name: getUserDisplayName(user) }))
                  ]"
                  item-title="display_name"
                  item-value="id"
                  :model-value="lead.assigned_to?.id || null"
                  density="compact"
                  variant="outlined"
                  hide-details
                  :placeholder="t('assign_manager')"
                  class="assign-select"
                  :loading="isAssigning"
                  @update:model-value="assignLeadToUser"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :title="item.raw.role === 'unassign' ? 'Remove Assign' : getUserDisplayName(item.raw)">
                      <template v-slot:subtitle v-if="item.raw.role !== 'unassign'">
                        <v-chip size="x-small" :color="item.raw.role === 'admin' ? 'error' : 'primary'">
                          {{ item.raw.role }}
                        </v-chip>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </div>
              <div v-else-if="lead.assigned_to" class="ml-2">
                <span>
                  {{ lead.assigned_to.first_name }} {{ lead.assigned_to.last_name }}
                  <v-chip size="small" color="primary" class="ml-2">
                    {{ lead.assigned_to.role }}
                  </v-chip>
                </span>
              </div>
              <div v-else class="ml-2">
                <v-chip color="grey" variant="outlined" size="small">
                  {{ t('not_assigned') }}
                </v-chip>
              </div>
            </div>
            
            <div class="info-item mb-3">
              <strong>{{ t('created_at') }}:</strong>
              <span class="ml-2">{{ formatDate(lead.created_at) }}</span>
            </div>
            
            <div class="info-item mb-3">
              <strong>{{ t('updated_at') }}:</strong>
              <span class="ml-2">{{ formatDate(lead.updated_at) }}</span>
            </div>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- <v-row v-if="lead.additional_data && isAdmin" class="mt-4">
        <v-col cols="12">
          <v-card variant="outlined" class="pa-4">
            <h3 class="text-h6 mb-4">{{ t('additional_data') }}</h3>
            <pre class="text-body-2">{{ JSON.stringify(lead.additional_data, null, 2) }}</pre>
          </v-card>
        </v-col>
      </v-row> -->
    </v-card-text>
  </v-card>



  <!-- Comments Section -->
  <CommentsSection v-if="lead" :lead-id="lead.id" class="mt-4" />

  <v-card v-else-if="loading" elevation="0" class="mt-4">
    <v-card-text class="text-center py-8">
      <v-progress-circular indeterminate color="primary" size="64" />
      <p class="mt-4">{{ t('loading') }}</p>
    </v-card-text>
  </v-card>

  <v-card v-else elevation="0" class="mt-4">
    <v-card-text class="text-center py-8">
      <p>{{ t('lead_not_found') }}</p>
      <v-btn color="primary" @click="navigateTo('/leads')">
        {{ t('back_to_leads') }}
      </v-btn>
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
          color="primary"
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
</template>

<style scoped lang="scss">
.alert-container {
  margin-bottom: 16px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.assign-select {
  min-width: 200px;
  max-width: 300px;
}

.call-btn {
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.call-btn:hover {
  opacity: 1;
}

@media (max-width: 600px) {
  .action-buttons {
    flex-direction: column;
    width: 100%;
    margin-top: 16px;
  }
  
  .action-buttons .v-btn {
    width: 100%;
  }
  
  .assign-select {
    min-width: 150px;
    max-width: 100%;
  }
}
</style>
