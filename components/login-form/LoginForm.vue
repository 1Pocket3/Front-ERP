<script setup lang="ts">
import { ref } from "vue";
import { Form } from "vee-validate";

import { useAuthStore } from "@/stores/auth/auth";

const authStore = useAuthStore();

const checkbox = ref(false);
const valid = ref(false);
const password = ref("");
const username = ref("");
const passwordRules = ref([
  (v: string) => !!v || "Password is required",
  (v: string) =>
    (v && v.length > 2) || "Password must be less than 2 characters",
]);
const usernameRules = ref([
  (v: string) => !!v || "Username is required",
  (v: string) =>
    /^[a-zA-Z0-9]+$/.test(v) ||
    "Username must contain only letters and numbers",
]);

async function validate(values: any, { setErrors }: any) {
  // // Проверка минимальной длины имени пользователя
  // if (username.value.length < 3) {
  //     setErrors({ username: 'Username must be at least 3 characters long' });
  //     return;
  // }

  // // Проверка минимальной длины пароля
  // if (password.value.length > 2) {
  //     setErrors({ password: 'Password must be at least 2 characters long' });
  //     return;
  // }

  let loginData = {
    username: username.value,
    password: password.value,
  };

  try {
    await authStore.login(loginData);
    return navigateTo("/main_page");
  } catch (error: any) {
    console.error("Error during login:", error);
    setErrors({ apiError: error.message });
  }
}
</script>

<template>
  <!-- <v-row class="d-flex mb-3">
        <v-col cols="6" sm="6" >
            <v-btn variant="outlined" size="large" class="border text-subtitle-1" block>
                <img :src="google" height="16" class="mr-2" alt="google" />
                <span class="d-sm-flex d-none mr-1">Sign in with</span>Google
            </v-btn>
        </v-col>
        <v-col cols="6" sm="6">
            <v-btn variant="outlined" size="large" class="border text-subtitle-1" block>
                <img :src="facebook" width="25" height="25" class="mr-1" alt="facebook" />
                <span class="d-sm-flex d-none mr-1">Sign in with</span>FB
            </v-btn>
        </v-col>
    </v-row> -->
  <!-- <div class="d-flex align-center text-center mb-6">
        <div class="text-h6 w-100 px-5 font-weight-regular auth-divider position-relative">
            <span class="bg-surface px-5 py-3 position-relative">or sign in with</span>
        </div>  
    </div> -->
  <Form @submit="validate" v-slot="{ errors, isSubmitting }" class="mt-5">
    <v-label class="text-subtitle-1 font-weight-semibold pb-2 text-lightText"
      >Username</v-label
    >
    <VTextField
      v-model="username"
      :rules="usernameRules"
      class="mb-8"
      required
      hide-details="auto"
    ></VTextField>
    <v-label class="text-subtitle-1 font-weight-semibold pb-2 text-lightText"
      >Password</v-label
    >
    <VTextField
      v-model="password"
      :rules="passwordRules"
      required
      hide-details="auto"
      type="password"
      class="pwdInput"
    ></VTextField>
    <div class="d-flex flex-wrap align-center my-3 ml-n2">
      <!-- <v-checkbox v-model="checkbox" :rules="[(v:any) => !!v || 'You must agree to continue!']" required hide-details color="primary">
                <template v-slot:label class="">Remeber this Device</template>
            </v-checkbox> -->
      <div class="ml-sm-auto">
        <RouterLink
          to=""
          class="text-primary text-decoration-none text-body-1 opacity-1 font-weight-medium"
          >Forgot Password ?</RouterLink
        >
      </div>
    </div>
    <v-btn
      size="large"
      :loading="isSubmitting"
      color="primary"
      :disabled="valid"
      block
      type="submit"
      flat
      >Sign In</v-btn
    >
    <div v-if="errors.apiError" class="mt-2">
      <v-alert color="error">{{ errors.apiError }}</v-alert>
    </div>
  </Form>
</template>
