<template lang="">
 <div>
    <v-text-field 
      class='current-password input'
      v-model="passwordForm.currentPassword" 
      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
      :type="show1 ? 'text' : 'password'"
      :hint="t('min_password_length')"
      :label="$t('password')"
      @click:append="show1 = !show1"
    ></v-text-field>
  
    <v-text-field
      class='new-password input'
      v-model="passwordForm.newPassword"  
      :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
      :type="show2 ? 'text' : 'password'"
      :hint="t('min_password_length')"
      :label="t('new_password')"
      @click:append="show2 = !show2"
    ></v-text-field>
  
    <v-text-field
      class='new-password-repeat input'
      v-model="passwordForm.newPasswordRepeat"  
      :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
      :type="show3 ? 'text' : 'password'"
      :hint="t('min_password_length')"
      :label="t('new_password_repeat')"
      @click:append="show3 = !show3"
    ></v-text-field>
  
    <v-btn @click="save">
      {{t('save')}}
    </v-btn>
 </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const show1 = ref(false);
const show2 = ref(false);
const show3 = ref(false);

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  newPasswordRepeat: '',
});

const  save = async() => {
  
  try {
    const response = await axios.post("", passwordForm)
  } catch(error) {
    console.error("Error:", error);
    alert(t('putch_password_eror'))
  }
};
</script>

<style scoped>
.input {
  margin-bottom: 10px;
}
</style>