<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
import FileMultiple from "@/components/form-elements/fileinput/FileInputMultiple.vue";
import axios from '@/utils/axios';


const { t } = useI18n();
// const select = ref("select");
// const inline = ref(null);

const breadcrumbs = ref([
  {
    text: "Add project",
    disabled: false,
    href: "#",
  },
]);

const request_statuses = ref([
  t("request_status_1"),
  t("request_status_2"),
  t("request_status_3"),
  t("request_status_4"),
  t("request_status_5"),
  t("request_status_6"),
  t("request_status_7"),
  t("request_status_8"),
]);

const projectData = ref({
  projectName: "",
  projectType: "",
  country: "",
  city: "",
  street: "",
  startDate: "",
  endDate: "",
  projectManager: "",
  projectStage: "",
  projectDescription: "",
  assignmentOfEmployees: "",
  removeEmployees: "",
  assignATeam: "",
  eliminateTheTeam: "",
  additionalText: "",
});
//TO DO CONNECT ALL REFS TO V-MODEL FIELD
const projectName = ref("");
const projectType = ref("");
const country = ref("");
const city = ref("");
const street = ref("");
const startDate = ref("");
const endDate = ref("");
const projectManager = ref("");
const projectStage = ref("");
const projectDescription = ref("");
const assignmentOfEmployees = ref("");
const removeEmployees = ref("");
const assignATeam = ref("");
const eliminateTheTeam = ref("");
const additionalText = ref("");

const collectValues = () => {
  projectData.value = {
    projectName: projectName.value,
    projectType: projectType.value,
    country: country.value,
    city: city.value,
    street: street.value,
    startDate: startDate.value,
    endDate: endDate.value,
    projectManager: projectManager.value,
    projectStage: projectStage.value,
    projectDescription: projectDescription.value,
    assignmentOfEmployees: assignmentOfEmployees.value,
    removeEmployees: removeEmployees.value,
    assignATeam: assignATeam.value,
    eliminateTheTeam: eliminateTheTeam.value,
    additionalText: additionalText.value,
  };

  console.log("COLLECTED", projectData);
};

const djangoResp = fetch('http://localhost:8000/projects/');
console.log('djangoResp:', djangoResp)
</script>
<template>
  <BaseBreadcrumb :projectTitle="undefined" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <!-- <v-alert variant="tonal" type="warning" color="primary" class="mb-6"> Person Info </v-alert> -->
  <v-row class="mt-2">
    <v-col cols="12" md="8" sm="10">
      <v-label class="mb-2 font-weight-medium">{{
        $t("request_name")
      }}</v-label>
      <v-text-field
        v-model="projectName"
        variant="outlined"
        color="primary"
      ></v-text-field>
      <v-label class="mb-2 font-weight-medium">{{
        $t("request_material")
      }}</v-label>
      <v-select
        :items="object_type"
        item-title="gender"
        item-value="abbr"
        return-object
        single-line
        variant="outlined"
      ></v-select>
      <v-label class="mb-2 font-weight-medium">{{
        $t("request_count")
      }}</v-label>
      <v-text-field variant="outlined" color="primary"></v-text-field>
      <v-label class="mb-2 font-weight-medium">{{
        $t("request_data_delivery")
      }}</v-label>
      <v-text-field
        variant="outlined"
        color="primary"
        type="date"
      ></v-text-field>
      <v-label class="mb-2 font-weight-medium">{{
        $t("request_measure_digit")
      }}</v-label>
      <v-text-field variant="outlined" color="primary"></v-text-field>
      <v-label class="mb-2 font-weight-medium">{{
        $t("manager_who_created")
      }}</v-label>
      <v-text-field color="primary" variant="outlined"></v-text-field>
      <v-label class="mb-2 font-weight-medium">{{ $t("spectators") }}</v-label>
      <v-text-field color="primary" variant="outlined"></v-text-field>
      <v-label class="mb-2 font-weight-medium">{{
        $t("manager_responsible")
      }}</v-label>
      <v-text-field color="primary" variant="outlined"></v-text-field>
      <v-label class="mb-2 font-weight-medium">{{
        $t("data_was_added")
      }}</v-label>
      <v-text-field
        variant="outlined"
        color="primary"
        type="date"
      ></v-text-field>
      <v-label class="white-space-normal d-flex mb-2 font-weight-medium label-wrap">{{
        $t("request_comments")
      }}</v-label>
      <v-text-field color="primary" variant="outlined"></v-text-field>
      <v-label class="mb-2 font-weight-medium">{{
        $t("request_number")
      }}</v-label>
      <v-text-field color="primary" variant="outlined"></v-text-field>
      <v-label class="white-space-normal d-flex mb-2 font-weight-medium label-wrap">{{
        $t("request_edit_text")
      }}</v-label>
      <v-text-field color="primary" variant="outlined"></v-text-field>
      <v-label class="mb-2 font-weight-medium">{{
        $t("request_deleted_text")
      }}</v-label>
      <v-text-field color="primary" variant="outlined"></v-text-field>
      <v-label class="mb-2 font-weight-medium">{{
        $t("request_status_text")
      }}</v-label>
      <v-select
        :items="request_statuses"
        item-title="gender"
        item-value="abbr"
        return-object
        single-line
        variant="outlined"
      ></v-select>
      <div class="mb-6">
        <FileMultiple />
      </div>
    </v-col>
  </v-row>
  <v-btn color="error" class="mr-3">{{ $t("cancel") }}</v-btn>
  <v-btn @click="collectValues" color="primary">{{ $t("save") }}</v-btn>
</template>

<style lang="scss" scoped>
.label-wrap {
  white-space: normal;
}
</style>
