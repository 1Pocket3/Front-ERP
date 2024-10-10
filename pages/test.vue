<template>
  <v-sheet color="#0d1117" elevation="4" rounded="lg">
    <v-tabs
      v-model="tab"
      :items="items"
      align-tabs="center"
      color="white"
      height="50"
      slider-color="#f78166"
    >
      <template v-slot:tab="{ item }" >
        <v-tab
          :prepend-icon="item.icon"
          :text="item.text"
          class="text-none"
        ></v-tab>
      </template>
    </v-tabs>
  </v-sheet>
</template>
<style scoped>
.custom-tab-width {
 

  
}
</style>
<script setup>
import { useI18n } from "vue-i18n";
import { ref, computed, defineProps } from "vue";
import "@vuepic/vue-datepicker/dist/main.css";
import 'vue-toastification/dist/index.css';
import { getCurrentInstance } from 'vue';
import {
  UserIcon,
  KeyIcon,
  IdIcon,
  BellIcon,
  LockIcon,
  CameraIcon,
} from "vue-tabler-icons";


let tab = ref(null);
const text = ref("fdfdf");
const date = ref();
const { appContext } = getCurrentInstance();
const { t } = useI18n();


const items = computed(() => [
  { text: t("acc"), icon: UserIcon, id: 0 },
  { text: t("change_password"), icon: KeyIcon, id: 1 },
  { text: t("personal_data"), icon: IdIcon, id: 2 },
  { text: t("alerts_configuration"), icon: BellIcon, id: 3 },
  { text: t("accept_modules"), icon: LockIcon, id: 4 },
])
</script>