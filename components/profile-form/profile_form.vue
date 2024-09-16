<template>
  <form @submit.prevent="submit">
    <v-text-field 
    class="input"
      v-model="login.value.value"
      :counter="10"
      :error-messages="login.errorMessage.value"
      :label="t('login')"
    ></v-text-field>

    <v-text-field
    class="input"
      v-model="email.value.value"
      :counter="7"
      :error-messages="email.errorMessage.value"
      :label="t('email')"
    ></v-text-field>

    <div class="nameLastName input"
    >
      <v-text-field
        class="name"
        v-model="name.value.value"
        :error-messages="name.errorMessage.value"
        :label="t('name')"
       
      ></v-text-field>
      <v-text-field
        v-model="lastName.value.value"
        :error-messages="lastName.errorMessage.value"
        :label="t('last_name')"
      ></v-text-field>
    </div>
    <v-date-input
      class="dateOfBirth input"
      variant="outlined"
      prepend-icon=""
      :label="t('date_of_birth')"
      :append-inner-icon="CalendarIcon"
      v-model="date.value.value"
      :error-messages="date.errorMessage.value"
      
    >
    </v-date-input>
    <!-- <v-select
      v-model="select.value.value"
      :error-messages="select.errorMessage.value"
      :items="items"
      :label="t('language')"
    ></v-select> -->

    <v-btn class="me-4" type="submit"> {{t('save')}} </v-btn>

    
  </form>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useField, useForm } from "vee-validate";
import { CalendarIcon } from "vue-tabler-icons";
import { VDateInput } from "vuetify/labs/VDateInput";
const { handleSubmit, handleReset } = useForm({
  validationSchema: {
    login(value) {
      if (value?.length >= 2) return true;
      return t('validation_login_error') 
    },
    name(value) {
      if (value?.length >= 2) return true;

      return t('validation_name_error') 
    },
    lastName(value) {
      if (value?.length >= 2) return true;
      return t('validation_last_name_error')
    },
    
    email(value) {
      if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true;

      return t('validation_email_error');
    },
    select(value) {
      if (value) return true;
      return t('validation_select_error');
    },
    date(value) {
if(value) return true;
return t('validation_date_error')
    },
  },
});

const { t } = useI18n();
const date = useField("date");
const login = useField("login");
const name = useField("name");
const email = useField("email");
const select = useField("select");
const lastName = useField("lastName");
const items = computed(()=> [t('rus'),t('rom'),]);
const submit = handleSubmit((values) => {
alert(JSON.stringify(values, null, 2));
}); 
</script> 

<style scoped lang="scss">
.nameLastName {
  display: flex;
  width: 50%;
}
.dateOfBirth {
  width: 25%;
}
.input {
  margin-bottom: 15px;
}
.name{
  margin-right: 10px
}
@media (max-width: 1099px) {
  .dateOfBirth{
    width: 50%;
  }
  .nameLastName {
    flex-direction: column;

    width: 100%;
  }
  .name{

  margin-right: 0;
}
@media(max-width: 900px) {
  .dateOfBirth{
    width: 100%;
  }
}

}
</style>