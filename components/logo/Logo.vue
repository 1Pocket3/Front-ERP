<script setup>
import { computed } from "vue";
// import LogoLight from "./LogoLight.vue";
import LogoDark from "./LogoDark.vue";
import { useCustomizerStore } from "@/stores/customizer";

const customizer = useCustomizerStore();

//const dark = ref(false);
const dark = computed(() => {
  if (
    customizer.actTheme === "DARK_BLUE_THEME" ||
    customizer.actTheme === "DARK_AQUA_THEME" ||
    customizer.actTheme === "DARK_ORANGE_THEME" ||
    customizer.actTheme === "DARK_PURPLE_THEME" ||
    customizer.actTheme === "DARK_GREEN_THEME" ||
    customizer.actTheme === "DARK_CYAN_THEME"
  ) {
    return true;
  } else {
    return false;
  }
});

</script>
<template>
  
  <!-- <LogoLight v-if="dark" /> -->
  <!-- <LogoDark v-else /> -->
	<NuxtLink :to="'/main_page'">
  <LogoDark/>
	</NuxtLink>
  <!-- <img v-else="dark" :src="data.imgUrl" alt="Logo" /> -->


  <!-- <img v-if="dark" src="../../../../public/assets/icon/logo/InamStroLogo.png" alt="Logo" /> -->
  <!-- <img v-else src="../../../../public/assets/icon/logo/InamStroLogo.png" alt="Logo" /> -->

</template>