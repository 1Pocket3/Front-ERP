<template>
  <v-dialog v-model="dialog" max-width="1200" persistent>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="me-2">mdi-table-column</v-icon>
        {{ t('column_mapping') }}
      </v-card-title>
      
      <v-card-text>
        <v-row>
          <!-- Левая колонка - поля Lead -->
          <v-col cols="12" md="6">
            <h3 class="text-h6 mb-4">{{ t('lead_fields') }}</h3>
            <v-card variant="outlined">
              <v-card-text>
                <div v-for="field in leadFields" :key="field.key" class="mb-3">
                  <v-label class="text-subtitle-2">
                    {{ field.label }}
                    <span v-if="field.required" class="text-error">*</span>
                  </v-label>
                  <v-select
                    v-model="columnMapping[field.key]"
                    :items="fileColumns"
                    :placeholder="t('select_column')"
                    clearable
                    variant="outlined"
                    density="compact"
                    :error-messages="getFieldError(field.key)"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <!-- Правая колонка - предварительный просмотр -->
          <v-col cols="12" md="6">
            <h3 class="text-h6 mb-4">{{ t('preview') }}</h3>
            <v-card variant="outlined">
              <v-card-text>
                <div class="text-caption mb-2">{{ t('sample_data') }}</div>
                <v-table density="compact" class="preview-table">
                  <thead>
                    <tr>
                      <th v-for="column in fileColumns" :key="column" class="text-caption">
                        {{ column }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, index) in sampleData" :key="index">
                      <td v-for="(cell, cellIndex) in row" :key="cellIndex" class="text-caption">
                        {{ cell || '-' }}
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        
        <!-- Выбор колонки с датой -->
        <v-row class="mt-4">
          <v-col cols="12">
            <h3 class="text-h6 mb-2">{{ t('lead_date_column') }}</h3>
            <v-select
              v-model="leadDateColumn"
              :items="dateColumns"
              :placeholder="t('select_date_column')"
              clearable
              variant="outlined"
              :hint="t('lead_date_column_hint')"
              persistent-hint
            />
          </v-col>
        </v-row>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey"
          variant="outlined"
          @click="cancel"
        >
          {{ t('cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          :loading="saving"
          :disabled="!isValidMapping"
          @click="saveMapping"
        >
          {{ t('save_mapping') }}
        </v-btn>
        <v-btn
          color="success"
          :loading="processing"
          :disabled="!isValidMapping"
          @click="processImport"
        >
          {{ t('process_import') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLeadsStore } from '@/stores/leads/leads';
import { useCustomizerStore } from '@/stores/customizer';

interface LeadField {
  key: string;
  label: string;
  required: boolean;
}

interface Props {
  modelValue: boolean;
  importId?: number;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'import-completed'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useI18n();
const store = useLeadsStore();
const customizer = useCustomizerStore();

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Данные
const fileColumns = ref<string[]>([]);
const sampleData = ref<any[][]>([]);
const leadFields = ref<LeadField[]>([]);
const columnMapping = ref<Record<string, string>>({});
const leadDateColumn = ref<string>('');
const currentMapping = ref<Record<string, string>>({});
const currentLeadDateColumn = ref<string>('');

// Состояние
const saving = ref(false);
const processing = ref(false);
const errors = ref<Record<string, string>>({});

// Вычисляемые свойства
const dateColumns = computed(() => {
  return fileColumns.value.filter(col => 
    col.toLowerCase().includes('date') || 
    col.toLowerCase().includes('time') ||
    col.toLowerCase().includes('created') ||
    col.toLowerCase().includes('received')
  );
});

const isValidMapping = computed(() => {
  // Проверяем обязательные поля
  const requiredFields = leadFields.value.filter(f => f.required);
  const hasRequiredFields = requiredFields.every(field => 
    columnMapping.value[field.key] && columnMapping.value[field.key].trim() !== ''
  );
  
  return hasRequiredFields;
});

// Методы
const getFieldError = (fieldKey: string) => {
  return errors.value[fieldKey] || [];
};

const loadImportData = async () => {
  if (!props.importId) return;
  
  try {
    const data = await store.getImportColumns(props.importId);
    fileColumns.value = data.file_columns || [];
    sampleData.value = data.sample_data || [];
    leadFields.value = data.lead_fields || [];
    
    // Загружаем существующий маппинг
    currentMapping.value = data.current_mapping || {};
    currentLeadDateColumn.value = data.lead_date_column || '';
    
    // Инициализируем маппинг
    columnMapping.value = { ...currentMapping.value };
    leadDateColumn.value = currentLeadDateColumn.value;
    
  } catch (error) {
    console.error('Error loading import data:', error);
    customizer.toggleAlertVisibility('error', 'Failed to load import data');
  }
};

const saveMapping = async () => {
  if (!props.importId) return;
  
  saving.value = true;
  errors.value = {};
  
  try {
    await store.saveColumnMapping(
      props.importId,
      columnMapping.value,
      leadDateColumn.value
    );
    
    customizer.toggleAlertVisibility('success', 'Column mapping saved successfully');
    
  } catch (error: any) {
    console.error('Error saving mapping:', error);
    
    if (error.response?.data?.column_mapping) {
      errors.value = error.response.data.column_mapping;
    } else {
      customizer.toggleAlertVisibility('error', 'Failed to save column mapping');
    }
  } finally {
    saving.value = false;
  }
};

const processImport = async () => {
  if (!props.importId) return;
  
  processing.value = true;
  
  try {
    // Сначала сохраняем маппинг
    await saveMapping();
    
    // Затем обрабатываем импорт
    const result = await store.processImportWithMapping(props.importId);
    
    customizer.toggleAlertVisibility('success', `Successfully processed ${result.processed_count} leads`);
    emit('import-completed');
    dialog.value = false;
    
  } catch (error) {
    console.error('Error processing import:', error);
    customizer.toggleAlertVisibility('error', 'Failed to process import');
  } finally {
    processing.value = false;
  }
};

const cancel = () => {
  dialog.value = false;
};

// Watchers
watch(() => props.importId, (newId) => {
  if (newId && props.modelValue) {
    loadImportData();
  }
});

watch(() => props.modelValue, (newValue) => {
  if (newValue && props.importId) {
    loadImportData();
  }
});
</script>

<style scoped>
.preview-table {
  max-height: 300px;
  overflow-y: auto;
}

.preview-table th,
.preview-table td {
  padding: 4px 8px;
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}
</style>
