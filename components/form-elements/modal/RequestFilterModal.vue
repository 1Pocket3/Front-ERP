<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { PencilIcon, FilterIcon, LayoutKanbanIcon } from "vue-tabler-icons";

const toggle = ref(null);
const { t } = useI18n();

const valid = ref(true);
const dialog = ref(false);

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
// const desserts = ref(contact);
const editedIndex = ref(-1);
const editedItem = ref({
  id: "",
  avatar: "1.jpg",
  userinfo: "",
  usermail: "",
  phone: "",
  jdate: "",
  role: "",
  projects_select: "",
  stage_select: "",
  types_project: "",
  location: "",
});
const defaultItem = ref({
  id: "",
  avatar: "1.jpg",
  userinfo: "",
  usermail: "",
  phone: "",
  jdate: "",
  role: "",
  projects_select: "",
  stage_select: "",
  types_project: "",
  location: "",
});

function close() {
  dialog.value = false;
  setTimeout(() => {
    editedItem.value = Object.assign({}, defaultItem.value);
    editedIndex.value = -1;
  }, 300);
}
function save() {
  if (editedIndex.value > -1) {
    // Object.assign(desserts.value[editedIndex.value], editedItem.value);
  } else {
    // desserts.value.push(editedItem.value);
  }
  close();
}
</script>
<template>
  <v-btn-toggle v-model="toggle" color="primary" variant="outlined">
    <v-btn>
      <LayoutKanbanIcon stroke-width="1.5" size="20" class="text-primary" />
      <v-tooltip
            activator="parent"
            location="top"
            style="font-size: small"
            >Kanban mode</v-tooltip
          >
    </v-btn>

    <v-dialog v-model="dialog" max-width="700">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" icon="mdi-format-align-center">
          <FilterIcon stroke-width="1.5" size="20" class="text-primary" />
          <v-tooltip
            activator="parent"
            location="top"
            style="font-size: small"
            >{{ $t("filters") }}</v-tooltip
          >
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="pa-4 bg-primary">
          <span class="title text-white">{{ $t("filters") }}</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  variant="outlined"
                  hide-details
                  v-model="editedItem.id"
                  :label="$t('request_name')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  variant="outlined"
                  hide-details
                  :label="$t('manager_who_created')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  variant="outlined"
                  hide-details
                  v-model="editedItem.usermail"
                  :label="$t('spectators')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  variant="outlined"
                  hide-details
                  v-model="editedItem.phone"
                  :label="$t('project_manager')"
                  type="phone"
                ></v-text-field>
              </v-col>
              <!-- <v-col cols="12" sm="6">
                  <v-select
                    variant="outlined"
                    hide-details
                    :items="stage_select"
                    v-model="editedItem.stage_select"
                    :label="$t('project_stage')"
                  ></v-select>
                </v-col> -->
              <v-col cols="12" sm="6">
                <v-text-field
                  variant="outlined"
                  hide-details
                  :label="$t('manager_responsible')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  variant="outlined"
                  hide-details
                  type="date"
                  :label="$t('data_was_added')"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  variant="outlined"
                  hide-details
                  :items="request_statuses"
                  return-object
                  :label="$t('request_status_text')"
                ></v-select>
              </v-col>
              <!-- <v-col cols="12" sm="12">
                  <v-select
                    variant="outlined"
                    hide-details
                    v-model="editedItem.rolestatus"
                    :label="$t('project_type')"
                  ></v-select>
                </v-col> -->
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="error" @click="close">{{ $t("cancel") }}</v-btn>
          <v-btn
            color="secondary"
            :disabled="editedItem.userinfo == '' || editedItem.usermail == ''"
            variant="flat"
            @click="save"
            >{{ $t("save") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- <v-btn icon="mdi-format-align-right">
                <PencilIcon stroke-width="1.5" size="20" class="text-primary"/>
            </v-btn> -->
  </v-btn-toggle>
</template>
