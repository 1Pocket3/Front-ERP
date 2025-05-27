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
      <VueDatePicker
        class="dateOfBirth input" 
        v-model="props.userData.date_of_birth" 
        format="yyyy-MM-dd"
        :locale="t('rus')" 
      />

    <v-btn class="me-4 btn" @click="submit"> {{ t("save") }} </v-btn>
  </form>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useField, useForm } from "vee-validate";
import { ref, computed, defineProps } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { format } from "date-fns";
import { useToast } from 'vue-toastification';
import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import { getCurrentInstance } from 'vue';

const props = defineProps({
  userData: {
    type: Object,
    required: true,
  },
});

const { appContext } = getCurrentInstance();
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
    date(value) {
      if (value) return true;
      return t("validation_date_error");
    },
  },
});

appContext.app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: "button",
  icon: true,
  rtl: false
});

const toast = useToast();
const showToast = (result) => {
  if(result) {
    toast.success(t("putch_data_success"), {
    position: "top-right",
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
    rtl: false
  });
} else {
  toast.error(t("putch_data_error"), {
    position: "top-right",
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
    rtl: false
  });
}
};
const submit = async () => {
  const formData = {
    date_of_birth: props.userData.date_of_birth
      ? format(new Date(props.userData.date_of_birth), "yyyy-MM-dd")
      : null,
    username: props.userData.username,
    first_name: props.userData.first_name,
    email: props.userData.email,
    last_name: props.userData.last_name,
  };
  
  try {
    const response = await axios.post("/profile/", formData);
    showToast(true)
    
  } catch (error) {
    console.error("Error:", error);
    showToast(false)
    console.log("Submit error", error)
  }
};
</script>
<style scoped lang="scss">
.nameLastName {
  display: flex;
  width: 50%;
}
.dateOfBirth {
  width: 24.5%;
  background-color: f9f9f9;

}
.dp__theme_light {
  --dp-background-color: rgb(249 249 249);
  --dp-input-padding: 11px 30px 11px 12px;
  --dp-border-radius:6px;
}

.btn {
  margin-top: 30px;
  height: 45px;
}
.input {
  margin-bottom: 15px;
}
.name {
  margin-right: 10px;
}

@media (max-width: 1099px) {
  .dateOfBirth {
    width: 100%;
  }
  .nameLastName {
    flex-direction: column;
    width: 100%;
  }
  .name {
    margin-right: 0;
  }

}
</style>