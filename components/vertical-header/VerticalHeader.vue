<script setup lang="ts">
import { ref } from "vue";
// import { useCustomizerStore } from "@/stores/customizer";
// import { useEcomStore } from '@/stores/apps/eCommerce';
import {
  Menu2Icon,
} from "vue-tabler-icons";
// import LanguageDD from "./LanguageDD.vue";
import NotificationDD from "./NotificationDD.vue";
import ProfileDD from "./ProfileDD.vue";


// const customizer = useCustomizerStore();
const props = defineProps<{
  customizer: {
    Sidebar_drawer: boolean;
    SET_MINI_SIDEBAR: (item: any) => void;
    mini_sidebar: boolean;
    SET_SIDEBAR_DRAWER:(item: any) => void;
  };
}>();


const toggleSidebar = () => {
  props.customizer.SET_MINI_SIDEBAR(!props.customizer.mini_sidebar);
};

// const closeSidebar = () => {
//   props.customizer.SET_MINI_SIDEBAR(false);
// };

// const openSidebar = () => {
//   props.customizer.SET_MINI_SIDEBAR(true);
// };

// count items
// const store = useEcomStore();
// const getCart = computed(() => {
//     return store.cart;
// });
</script>

<template>
  <v-app-bar elevation="0" height="70" class="">
    <v-btn
      class="hidden-md-and-down"
      icon
      color="primary"
      variant="text"
      @click.stop="toggleSidebar"
    >
      <Menu2Icon size="20" stroke-width="1.5" />
    </v-btn>
    <v-btn
      class="hidden-lg-and-up"
      icon
      variant="flat"
      @click.stop="customizer.SET_SIDEBAR_DRAWER"
      size="small"
    >
      <Menu2Icon size="20" stroke-width="1.5" />
    </v-btn>

    <!-- search mobile -->
    <!-- <v-btn class="hidden-lg-and-up ml-3" icon variant="text" color="primary" @click="searchbox">
            <SearchIcon size="17" stroke-width="1.5" />
        </v-btn> -->

    <!-- <v-sheet v-if="showSearch" class="search-sheet v-col-12">
            <Searchbar :closesearch="searchbox" />
        </v-sheet> -->

    <!-- ---------------------------------------------- -->
    <!-- Search part -->
    <!-- ---------------------------------------------- -->
    <!-- <v-sheet>
      <Searchbar />
    </v-sheet> -->

    <!---/Search part -->

    <!-- ---------------------------------------------- -->
    <!-- Mega menu -->
    <!-- ---------------------------------------------- -->
    <!-- <div class="hidden-md-and-down">
            <Navigations />
        </div> -->
    <v-spacer />
    <!-- ---------------------------------------------- -->
    <!---right part -->
    <!-- ---------------------------------------------- -->
    <!-- ---------------------------------------------- -->
    <!-- translate -->
    <!-- ---------------------------------------------- -->
    <!-- <LanguageDD /> -->

    <!-- ---------------------------------------------- -->
    <!-- ShoppingCart -->
    <!-- ---------------------------------------------- -->
    <!-- <v-btn icon variant="text" color="primary" to="/ecommerce/checkout">
            <v-badge  color="error" :content="getCart?.length">
                <ShoppingCartIcon stroke-width="1.5" size="22" />
            </v-badge>
        </v-btn> -->

    <!-- ---------------------------------------------- -->
    <!-- Notification -->
    <!-- ---------------------------------------------- -->
    <NotificationDD />

    <!-- right sidebar -->
    <!-- <v-btn
      variant="text"
      color="primary"
      class="hidden-lg-and-up"
      icon
      @click.stop="appsdrawer = !appsdrawer"
    >
      <GridDotsIcon size="17" stroke-width="1.5" />
    </v-btn> -->

    <!-- ---------------------------------------------- -->
    <!-- User Profile -->
    <!-- ---------------------------------------------- -->
    <div class="ml-2">
      <ProfileDD />
    </div>
  </v-app-bar>

  <!-- ---------------------------------------------- -->
  <!-- Right Sidebar -->
  <!-- ---------------------------------------------- -->
  <!-- <v-navigation-drawer v-model="appsdrawer" location="right" temporary>
    <RightMobileSidebar />
  </v-navigation-drawer> -->
</template>
