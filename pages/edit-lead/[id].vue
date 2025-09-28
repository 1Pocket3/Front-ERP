<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useLeadsStore, type Lead } from "@/stores/leads/leads";
import { useCustomizerStore } from "@/stores/customizer";
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";

const { t } = useI18n();
const store = useLeadsStore();
const customizer = useCustomizerStore();

const route = useRoute();
const leadId = parseInt(route.params.id as string);

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
const lead = ref<Lead | null>(null);

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

const fetchLead = async () => {
  loading.value = true;
  try {
    lead.value = await store.getLeadById(leadId);
    if (lead.value) {
      form.value = {
        first_name: lead.value.first_name,
        last_name: lead.value.last_name || "",
        phone: lead.value.phone,
        email: lead.value.email || "",
        company: lead.value.company || "",
        lead_source: lead.value.lead_source || "",
      };
    }
  } catch (error) {
    console.error("Error fetching lead:", error);
    customizer.toggleAlertVisibility();
    typeAlert.value = "error";
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  if (!form.value.first_name || !form.value.phone) {
    customizer.toggleAlertVisibility();
    typeAlert.value = "error";
    return;
  }

  loading.value = true;
  try {
    await store.updateLead(leadId, form.value);
    customizer.toggleAlertVisibility();
    typeAlert.value = "success";
    
    // Перенаправляем на страницу лидов
    await navigateTo('/leads');
  } catch (error) {
    console.error("Error updating lead:", error);
    customizer.toggleAlertVisibility();
    typeAlert.value = "error";
  } finally {
    loading.value = false;
  }
};

const cancelForm = () => {
  navigateTo('/leads');
};

onMounted(async () => {
  await fetchLead();
});
</script>

<template>
  <BaseBreadcrumb :project-title="t('edit_lead')" />
  
  <div class="mt-2 alert-container" v-if="customizer.showAlert">
    <Alerts :t="t" :type="typeAlert" />
  </div>

  <v-card elevation="0" class="mt-4" v-if="lead">
    <v-card-title class="text-h5 py-4">
      {{ t('edit_lead') }}: {{ lead.full_name }}
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
</template>

<style scoped lang="scss">
.alert-container {
  margin-bottom: 16px;
}
</style>
