<script setup lang="ts">
import { useAuthStore } from "@/stores/auth/auth";

const authStore = useAuthStore();

// Layout уже загружает данные пользователя, здесь только читаем их
const getUserDisplayName = () => {
  const user = authStore.getCurrentUser;
  if (!user) return "Loading...";
  
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  return user.username || user.email || "User";
};

const getUserRole = () => {
  const user = authStore.getCurrentUser;
  if (!user) return "";
  
  const role = user.role;
  switch (role) {
    case 'admin':
      return 'Administrator';
    case 'manager':
      return 'Manager';
    default:
      return role || 'User';
  }
};
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!-- notifications DD -->
  <!-- ---------------------------------------------- -->
  <v-menu :close-on-content-click="true">
    <template v-slot:activator="{ props }">
      <v-btn class="custom-hover-primary" variant="text" v-bind="props" icon>
        <v-avatar size="35" color="primary">
          <v-icon size="20" color="white">mdi-account</v-icon>
        </v-avatar>
      </v-btn>
    </template>
    <v-sheet rounded="md" width="360" elevation="10">
      <div class="px-8 pt-6">
        <h6 class="text-h5 font-weight-medium">
          {{ $t("pop_profile_title") }}
        </h6>
        <div class="d-flex align-center mt-4 pb-6">
          <v-avatar size="80" color="primary">
            <v-icon size="40" color="white">mdi-account</v-icon>
          </v-avatar>
          <div class="ml-3">
            <h6 class="text-h6 mb-n1">
              {{ getUserDisplayName() }}
            </h6>
            <span class="text-subtitle-1 font-weight-regular textSecondary">
              {{ getUserRole() }}
            </span>
          </div>
        </div>
        <v-divider></v-divider>
      </div>
      <!-- <v-list class="py-0 theme-list" lines="two">
        <v-list-item
          v-for="item in profileDD"
          :key="item.title"
          class="py-3 px-8 custom-text-primary"
          :to="item.href"
        >
          <template v-slot:prepend>
            <v-avatar size="48" color="profileIconBgColor" rounded="md">
              <div>
                <v-img
                  :src="item.avatar"
                  width="30"
                  height="30"
                  :alt="item.avatar"
                />
              </div>
            </v-avatar>
          </template>
          <div>
            <h6 class="text-subtitle-1 mb-n1 font-weight-bold">
              {{ $t("my_profile") }}
            </h6>
            <p
              class="text-subtitle-1 font-weight-regular textSecondary custom-paragraph"
            >
              {{ $t("my_profile_settings") }}
            </p>
          </div>
        </v-list-item>
      </v-list> -->
      <!-- </perfect-scrollbar> -->
      <!-- <div class="px-8 py-3">
                <div class="bg-lightprimary rounded-md pa-5 overflow-hidden position-relative">
                    <h5 class="text-h6">
                        Unlimited<br />
                        Access
                    </h5>
                    <v-btn variant="flat" color="primary" class="mt-3">Upgrade</v-btn>
                    <img src="@/assets/images/backgrounds/unlimited-bg.png" alt="bg-img" class="right-pos-img" />
                </div>
            </div> -->
      <div class="pt-4 pb-6 px-8 text-center">
        <v-btn
          color="primary"
          variant="outlined"
          block
          @click="authStore.logout"
          >{{ $t("exit") }}</v-btn
        >
      </div>
    </v-sheet>
  </v-menu>
</template>
