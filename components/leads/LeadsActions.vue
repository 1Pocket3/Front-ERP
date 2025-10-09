<script setup lang="ts">
import { useI18n } from 'vue-i18n';

interface Props {
  isAdmin: boolean;
  loading: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  'refresh': [];
  'import': [];
  'add-lead': [];
  'export-csv': [];
  'export-excel': [];
  'clear': [];
}>();

const { t } = useI18n();
</script>

<template>
  <div class="actions-section">
    <div class="actions-row">
      <v-btn
        color="info"
        variant="outlined"
        @click="emit('refresh')"
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
        @click="emit('import')"
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
        @click="emit('add-lead')"
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
        @click="emit('export-csv')"
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
        @click="emit('export-excel')"
        class="action-btn"
        size="small"
      >
        <v-icon size="small">mdi-file-excel</v-icon>
        <span class="btn-text">Export Excel</span>
      </v-btn>
      
      <v-btn
        variant="text"
        @click="emit('clear')"
        class="action-btn"
        size="small"
      >
        <span class="btn-text">{{ t('clear') }}</span>
      </v-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
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

@media (max-width: 768px) {
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

@media (max-width: 576px) {
  .actions-section {
    .actions-row {
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

@media (max-width: 400px) {
  .actions-section {
    .actions-row {
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
</style>

