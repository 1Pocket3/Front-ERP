<script setup lang="ts">
import { computed } from 'vue';
import type { LeadFilters } from '@/types/leads';
import { useI18n } from 'vue-i18n';
import { STATUS_LIST } from '@/types/leads';
import { getUserDisplayName } from '@/utils/leadsHelpers';

interface Props {
  filters: LeadFilters;
  allUsers: any[];
  availableCampaigns: string[];
  isAdmin: boolean;
  loading: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:search': [value: string];
  'update:managerFilter': [value: number | null];
  'update:statusFilter': [value: string[]];
  'update:campaignFilter': [value: string[]];
  'update:assignedFilter': [value: 'any' | 'assigned' | 'unassigned'];
  'search': [];
  'apply': [];
}>();

const { t } = useI18n();

const usersWithDisplay = computed(() => 
  props.allUsers.map(user => ({
    ...user,
    display_name: getUserDisplayName(user)
  }))
);

const assignedOptions = computed(() => [
  { title: t('all'), value: 'any' },
  { title: t('assigned_to'), value: 'assigned' },
  { title: t('not_assigned'), value: 'unassigned' }
]);
</script>

<template>
  <div class="filters-section">
    <div class="filters-row">
      <!-- Manager filter (admin only) -->
      <v-select
        v-if="isAdmin"
        :model-value="filters.managerFilter"
        :items="usersWithDisplay"
        item-title="display_name"
        item-value="id"
        density="compact"
        variant="outlined"
        hide-details
        clearable
        class="filter-item manager-filter"
        :label="t('assigned_to')"
        @update:model-value="(v) => { emit('update:managerFilter', v); emit('apply'); }"
      />

      <!-- Status filter (multi) -->
      <v-select
        :model-value="filters.statusFilter"
        :items="STATUS_LIST"
        multiple
        density="compact"
        variant="outlined"
        hide-details
        clearable
        class="filter-item status-filter"
        label="Status"
        @update:model-value="(v) => { emit('update:statusFilter', v); emit('apply'); }"
      />

      <!-- Campaign filter (multi) -->
      <v-select
        v-if="isAdmin"
        :model-value="filters.campaignFilter"
        :items="availableCampaigns"
        multiple
        density="compact"
        variant="outlined"
        hide-details
        clearable
        class="filter-item campaign-filter"
        label="Campaign"
        @update:model-value="(v) => { emit('update:campaignFilter', v); emit('apply'); }"
      />

      <!-- Assigned filter -->
      <v-select
        v-if="isAdmin"
        :model-value="filters.assignedFilter"
        :items="assignedOptions"
        item-title="title"
        item-value="value"
        density="compact"
        variant="outlined"
        hide-details
        class="filter-item assigned-filter"
        @update:model-value="(v) => { emit('update:assignedFilter', v); emit('apply'); }"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
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
}

@media (max-width: 1200px) {
  .filters-section .filters-row {
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
  .filters-section .filters-row {
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
  .filters-section {
    .filters-row {
      flex-direction: column;
      gap: 8px;

      .filter-item {
        min-width: 100%;
        width: 100%;
      }
    }
  }
}
</style>

