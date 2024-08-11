<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { FilterIcon, LayoutKanbanIcon } from "vue-tabler-icons";

const toggle = ref(null);
const { t } = useI18n();

const valid = ref(true);
const dialog = ref(false);
const projects_select = ref([
  t("residential_constructions"),
  t("commercial_constructions"),
  t("industrial_construction"),
  t("public_infrastructure"),
]);

const stage_select = ref([
  t("idea_and_concept"),
  t("planning"),
  t("design_and_development"),
  t("sales_and_construction"),
  t("testing_and_verification"),
  t("completion"),
  t("launch_and_commissioning"),
  t("closing_the_project"),
]);
const location_select = ref([t("country"), t("city"), t("street")]);
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

// const formTitle = computed(() => {
//     return editedIndex.value === -1 ? 'Filters' : 'Edit Contact';
// });
</script>
<template>
  <div>
    <v-btn-toggle v-model="toggle" variant="outlined">
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
                    :label="$t('project_name')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    variant="outlined"
                    hide-details
                    type="date"
                    v-model="editedItem.userinfo"
                    :label="$t('start_date')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    variant="outlined"
                    hide-details
                    type="date"
                    v-model="editedItem.usermail"
                    :label="$t('end_date')"
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
                <v-col cols="12" sm="6">
                  <v-select
                    variant="outlined"
                    hide-details
                    :items="stage_select"
                    v-model="editedItem.stage_select"
                    :label="$t('project_stage')"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    variant="outlined"
                    hide-details
                    :items="projects_select"
                    v-model="editedItem.projects_select"
                    :label="$t('project_type')"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    variant="outlined"
                    hide-details
                    :items="location_select"
                    v-model="editedItem.location"
                    :label="$t('location')"
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
    </v-btn-toggle>
  </div>
</template>
