<template>
  <form @submit.prevent="submit">
    <v-text-field
      class="input"
      v-model="props.userData.username"
      :counter="10"
      :label="t('login')"
    ></v-text-field>

    <v-text-field
      class="input"
      v-model="props.userData.email"
      :counter="7"
      :label="t('email')"
    ></v-text-field>

    <div class="nameLastName input">
      <v-text-field
        class="name"
        v-model="props.userData.first_name"
        :label="t('name')"
      ></v-text-field>
      <v-text-field
        v-model="props.userData.last_name"
        :label="t('last_name')"
      ></v-text-field>
    </div>

    <v-date-input
      class="dateOfBirth input"
      variant="outlined"
      prepend-icon=""
      :label="t('date_of_birth')"
      :append-inner-icon="CalendarIcon"
      v-model="props.userData.date_of_birth"
    ></v-date-input>

    <!-- <v-select
      v-model="formFields.select.value.value"
      :error-messages="formFields.select.errorMessage.value"
      :items="items"
      :label="t('language')"
    ></v-select> -->

    <v-btn class="me-4" @click="submit"> {{ t("save") }} </v-btn>
  </form>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useField, useForm } from "vee-validate";
import { CalendarIcon } from "vue-tabler-icons";
import { VDateInput } from "vuetify/labs/VDateInput";
import { ref, computed } from "vue";

const props = defineProps({
  userData: {
    type: Object,
    required: true,
  },
});

console.log("Props:", props.userData);




const { t } = useI18n();
const { handleSubmit } = useForm({
  validationSchema: {
    login(value) {
      if (value?.length >= 2) return true;
      return t("validation_login_error");
    },
    name(value) {
      if (value?.length >= 2) return true;
      return t("validation_name_error");
    },
    lastName(value) {
      if (value?.length >= 2) return true;
      return t("validation_last_name_error");
    },
    email(value) {
      if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true;
      return t("validation_email_error");
    },
    select(value) {
      if (value) return true;
      return t("validation_select_error");
    },
    date(value) {
      if (value) return true;
      return t("validation_date_error");
    },
  },
});

const items = computed(() => [t("rus"), t("rom")]);

const submit = async () => {
  const formData = {
    date_of_birth: props.userData.date_of_birth,
    username: props.userData.username,
    first_name: props.userData.first_name,
    email: props.userData.email,
    last_name: props.userData.last_name,
  };
  console.log("Form data:", formData);
  try {
    const response = await axios.post("/profile/", formData);
    console.log("Payload:", response.data);
   
  } catch (error) {
    console.error("Error:", error);
    alert(t("post_server_erorr"));
  }
};
</script>