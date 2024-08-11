<script setup lang="ts">
import { ref, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import ro from '@/assets/images/flag/ro.svg';
import ru from '@/assets/images/flag/ru.svg';
import { languageDD } from '@/_mockApis/headerData';
import { useLocale } from 'vuetify';

const { locale: i18nLocale } = useI18n();
const vuetifyLocale = useLocale(); 
const currentFlag = ref(i18nLocale.value === 'ro' ? ro : ru);

const changeLanguage = (lang: string) => {
  i18nLocale.value = lang;
  vuetifyLocale.current.value = lang
  currentFlag.value = lang === 'ro' ? ro : ru;
};
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!-- language DD -->
  <!-- ---------------------------------------------- -->
  <v-menu :close-on-content-click="true" location="bottom">
    <template v-slot:activator="{ props }">
      <v-btn icon variant="text" color="primary" v-bind="props">
        <v-avatar size="22">
          <img
            v-if="$i18n.locale === 'ro'"
            :src="ro"
            :alt="$i18n.locale"
            width="22"
            height="22"
            class="obj-cover"
          />
          <img
            v-if="$i18n.locale === 'ru'"
            :src="ru"
            :alt="$i18n.locale"
            width="22"
            height="22"
            class="obj-cover"
          />
        </v-avatar>
      </v-btn>
    </template>

    <v-sheet rounded="md" width="115" elevation="10">
      <v-list class="theme-list">
        <v-list-item
          v-for="(item, index) in languageDD"
          :key="index"
          color="primary"
          :active="$i18n.locale === item.value"
          class="d-flex align-center"
          @click="changeLanguage(item.value)"
        >
          <template v-slot:prepend>
            <v-avatar size="22">
              <img
                :src="item.avatar"
                :alt="item.avatar"
                width="22"
                height="22"
                class="obj-cover"
              />
            </v-avatar>
          </template>
          <span class="text-disabled text-subtitle-1 pl-2">{{ item.subtext }}</span>
        </v-list-item>
      </v-list>
    </v-sheet>
  </v-menu>
</template>
