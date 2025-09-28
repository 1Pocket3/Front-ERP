<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useLeadsStore } from "@/stores/leads/leads";
import { useCustomizerStore } from "@/stores/customizer";
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";

const { t } = useI18n();
const store = useLeadsStore();
const customizer = useCustomizerStore();

const form = ref({
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  company: "",
  lead_source: "",
});

const loading = ref(false);
const typeAlert = ref("success");

const rules = {
  required: (value: string) => !!value || t('required'),
  email: (value: string) => {
    if (!value) return true;
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value) || t('validation_email_error');
  },
  phone: (value: string) => {
    if (!value) return t('required');
    const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
    return phonePattern.test(value.replace(/[\s\-\(\)]/g, '')) || t('validation_phone_error');
  },
};

const submitForm = async () => {
  if (!form.value.first_name || !form.value.phone) {
    customizer.toggleAlertVisibility();
    typeAlert.value = "error";
    return;
  }

  loading.value = true;
  try {
    await store.createLead(form.value);
    customizer.toggleAlertVisibility();
    typeAlert.value = "success";
    
    // Очищаем форму
    form.value = {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      company: "",
      lead_source: "",
    };
    
    // Перенаправляем на страницу лидов
    await navigateTo('/leads');
  } catch (error) {
    console.error("Error creating lead:", error);
    customizer.toggleAlertVisibility();
    typeAlert.value = "error";
  } finally {
    loading.value = false;
  }
};

const cancelForm = () => {
  navigateTo('/leads');
};
</script>

<template>
  <BaseBreadcrumb :project-title="t('add_lead')" />
  
  <div class="mt-2 alert-container" v-if="customizer.showAlert">
    <Alerts :t="t" :type="typeAlert" />
  </div>

  <v-card elevation="0" class="mt-4">
    <v-card-title class="text-h5 py-4">
      {{ t('add_lead') }}
    </v-card-title>
    
    <v-card-text>
      <v-form @submit.prevent="submitForm">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.first_name"
              :label="t('first_name')"
              :rules="[rules.required]"
              required
              variant="outlined"
            />
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.last_name"
              :label="t('last_name')"
              variant="outlined"
            />
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.phone"
              :label="t('phone')"
              :rules="[rules.phone]"
              required
              variant="outlined"
              placeholder="+7-900-123-45-67"
            />
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.email"
              :label="t('email')"
              :rules="[rules.email]"
              variant="outlined"
              type="email"
            />
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.company"
              :label="t('company')"
              variant="outlined"
            />
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.lead_source"
              :label="t('lead_source')"
              variant="outlined"
            />
          </v-col>
        </v-row>
        
        <v-card-actions class="pa-0 mt-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="outlined"
            @click="cancelForm"
            :disabled="loading"
          >
            {{ t('cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            type="submit"
            :loading="loading"
            :disabled="!form.first_name || !form.phone"
          >
            {{ t('save') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
.alert-container {
  margin-bottom: 16px;
}
</style>
