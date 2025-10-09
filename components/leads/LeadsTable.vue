<script setup lang="ts">
import { computed, type ComputedRef } from 'vue';
import type { LeadRow } from '@/types/leads';
import { STATUS_OPTIONS } from '@/types/leads';
import { useI18n } from 'vue-i18n';
import { maskPhoneNumber, getUserDisplayName, getStatusColor, getStatusIcon } from '@/utils/leadsHelpers';
import { useAuthStore } from '@/stores/auth/auth';

interface Props {
  items: LeadRow[];
  loading: boolean;
  selectedRows: LeadRow[];
  allUsers: any[];
  isAdmin: boolean;
  isManager: boolean;
  bulkAssignUserId: number | null;
  bulkStatusValue: string | null;
  totalCount: number;
  searchQuery: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:selectedRows': [value: LeadRow[]];
  'update:bulkAssignUserId': [value: number | null];
  'update:bulkStatusValue': [value: string | null];
  'assign-lead': [leadId: number, userId: number | null];
  'make-call': [leadId: number];
  'bulk-apply': [];
  'clear-search': [];
}>();

const { t } = useI18n();
const authStore = useAuthStore();

const headers: ComputedRef = computed(() => [
  { title: "ID", align: "start", key: "id", sortable: true },
  { title: t("full_name"), align: "start", key: "full_name", sortable: true },
  { title: t("phone"), align: "start", key: "phone", sortable: true },
  { title: t("email"), align: "start", key: "email", sortable: true },
  { title: t("company"), align: "start", key: "company", sortable: true },
  { title: t("lead_source"), align: "start", key: "lead_source", sortable: true },
  { title: 'Status', align: 'start', key: 'status', sortable: true },
  { title: t("assigned_to"), align: "start", key: "assigned_to", sortable: true },
  { title: t("created_at"), align: "start", key: "created_at", sortable: true },
  { title: "Last Note", align: "start", key: "last_note_date", sortable: true },
]);

const usersWithDisplay = computed(() => 
  props.allUsers.map(user => ({
    ...user,
    display_name: getUserDisplayName(user)
  }))
);

const selectedRowsLocal = computed({
  get: () => props.selectedRows,
  set: (value) => emit('update:selectedRows', value)
});

const bulkAssignUserIdLocal = computed({
  get: () => props.bulkAssignUserId,
  set: (value) => emit('update:bulkAssignUserId', value)
});

const bulkStatusValueLocal = computed({
  get: () => props.bulkStatusValue,
  set: (value) => emit('update:bulkStatusValue', value)
});

const clearBulkSelection = () => {
  emit('update:bulkAssignUserId', null);
  emit('update:bulkStatusValue', null);
  emit('update:selectedRows', []);
};
</script>

<template>
  <v-card elevation="0" class="lead-card">
    <v-data-table
      :items-per-page="-1"
      :page="1"
      :headers="headers"
      item-key="id"
      :items="items"
      :return-object="true"
      v-model="selectedRowsLocal"
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
              v-model="bulkAssignUserIdLocal"
              :items="usersWithDisplay"
              item-title="display_name"
              item-value="id"
              density="compact"
              variant="outlined"
              hide-details
              style="min-width: 220px;"
              :label="t('assign_manager')"
            />
            
            <!-- Change Status Section -->
            <v-select
              v-if="isManager || isAdmin"
              v-model="bulkStatusValueLocal"
              :items="STATUS_OPTIONS"
              item-title="text"
              item-value="value"
              density="compact"
              variant="outlined"
              hide-details
              style="min-width: 180px;"
              :label="t('change_status')"
            />
            
            <!-- Apply Changes Button -->
            <v-btn 
              color="primary" 
              variant="flat" 
              :disabled="bulkAssignUserId===null && !bulkStatusValue" 
              @click="emit('bulk-apply')"
            >
              {{ t('apply_changes') }}
            </v-btn>
            
            <!-- Cancel Button -->
            <v-btn color="error" variant="outlined" @click="clearBulkSelection">
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
            @click="emit('clear-search')"
          >
            {{ t('clear_search') }}
          </v-btn>
        </div>
      </template>

      <!-- ID column -->
      <template v-slot:item.id="{ item }">
        <span class="text-body-2 font-weight-medium">{{ item.id }}</span>
      </template>

      <!-- Full name with link -->
      <template v-slot:item.full_name="{ item }">
        <NuxtLink :to="`/lead/${item.id}`" class="font-weight-medium text-primary" @click.stop>
          {{ item.full_name }}
        </NuxtLink>
      </template>

      <!-- Phone column with call button -->
      <template v-slot:item.phone="{ item }">
        <div v-if="item.phone" class="d-flex align-center gap-2">
          <span class="text-body-2">{{ maskPhoneNumber(item.phone, isAdmin) }}</span>
          <v-btn
            icon="mdi-phone"
            size="small"
            variant="text"
            :color="authStore.callingLeadId === item.id ? 'success' : authStore.isCalling && authStore.callingLeadId !== item.id ? 'error' : 'success'"
            :loading="authStore.callingLeadId === item.id"
            :disabled="authStore.isCalling"
            @click.stop="emit('make-call', item.id)"
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
        <v-chip 
          :color="getStatusColor(item.status)" 
          size="small" 
          variant="outlined" 
          :class="`status-${item.status.toLowerCase().replace(/\s+/g, '-')}`"
        >
          <v-icon start size="x-small" class="mr-1">
            {{ getStatusIcon(getStatusColor(item.status)) }}
          </v-icon>
          {{ item.status }}
        </v-chip>
      </template>

      <!-- Assigned to column -->
      <template v-slot:item.assigned_to="{ item }">
        <div v-if="isAdmin" class="d-flex align-center" @click.stop>
          <v-select
            v-if="!item.assigned_to"
            :items="usersWithDisplay"
            item-title="display_name"
            item-value="id"
            density="compact"
            variant="outlined"
            hide-details
            :placeholder="t('assign_manager')"
            class="assign-select"
            @update:model-value="(userId: any) => emit('assign-lead', item.id, userId)"
            @click.stop
          >
            <template v-slot:item="{ props: itemProps, item: userItem }">
              <v-list-item v-bind="itemProps" :title="getUserDisplayName(userItem.raw)">
                <template v-slot:subtitle>
                  <v-chip size="x-small" :color="userItem.raw.role === 'admin' ? 'error' : 'primary'">
                    {{ userItem.raw.role }}
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
              @click.stop="emit('assign-lead', item.id, null)"
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

      <!-- Created at column -->
      <template v-slot:item.created_at="{ item }">
        <span class="text-body-2 text-medium-emphasis">{{ item.created_at }}</span>
      </template>
    </v-data-table>
  </v-card>
</template>

<style scoped lang="scss">
.table-loading {
  opacity: 0.6;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.table-hover tr:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
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
</style>

