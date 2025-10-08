<script setup lang="ts">
import { shallowRef } from "vue";
import sidebarItems from "./sidebarItem";

import NavGroup from "./NavGroup/index.vue";
import NavItem from "./NavItem/index.vue";
import NavCollapse from "./NavCollapse/NavCollapse.vue";
import Logo from "~/components/logo/Logo.vue";

// const customizer = useCustomizerStore();
const sidebarMenu = shallowRef(sidebarItems);
const props = defineProps<{
  miniSidebar: boolean;
  customizer: { Sidebar_drawer: boolean };
}>();
</script>

<!-- v-model="customizer.Sidebar_drawer" -->
<!-- :rail="customizer.mini_sidebar" -->

<template>
    <div>
      <v-navigation-drawer
        left
        v-model="props.customizer.Sidebar_drawer"
        elevation="0"
        rail-width="75"
        app
        class="leftSidebar"
        :rail="props.miniSidebar"
        expand-on-hover
        width="270"
      >
        <div class="pa-5">
          <Logo />
        </div>

        <!-- ---------------------------------------------- -->
        <!---Navigation -->
        <!-- ---------------------------------------------- -->
        <div class="scrollnavbar custom-scrollbar">
          <v-list class="pa-6">
            <!---Menu Loop -->
            <template v-for="(item, i) in sidebarMenu">
              <!---Item Sub Header -->
              <NavGroup :item="item" v-if="item.header" :key="item.title" />
              <!---If Has Child -->
              <NavCollapse
                class="leftPadding"
                :item="item"
                :level="0"
                v-else-if="item.children"
              />
              <!---Single Item-->
              <NavItem :item="item" v-else class="leftPadding" />
              <!---End Single Item-->
            </template>
          </v-list>
          <!-- <div class="pa-6 userbottom">
                <Profile />
            </div> -->
        </div>
      </v-navigation-drawer>
    </div>
</template>
