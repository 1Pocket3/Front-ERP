<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>

<template>
  <v-file-input
    :label="t('file_input')"
    hide-details
    variant="outlined"
  ></v-file-input>
</template>
