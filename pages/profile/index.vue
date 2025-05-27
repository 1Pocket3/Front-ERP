<template>
  <div class="wrapper">
    <div class="menu">
      <Profile_menu
        @changeItem="changePadge"
        v-if="isScreenWide && isStoreReady"
        :items="items"
        :user-data="profileFormData"
      />
    </div>
    <div class="form">
      <ProfileMenuMobile
        v-if="!isScreenWide"
        @changeItem="changePadge"
        :items="items"
      />

      <Profile_form
        class="inside-form"
        v-if="itemSelected === 0"
        :user-data="profileFormData"
      />
      <div>
        <ChangePassword class="inside-form" v-if="itemSelected === 1" />
      </div>
      <div>
        <PersonalData class="inside-form" v-if="itemSelected === 2" />
      </div>
      <div class="inside-form">
        <ProfileForm v-if="itemSelected === 3" />
      </div>
      <div class="inside-form">
        <ProfileForm v-if="itemSelected === 4" />
      </div>
      <div class="inside-form">
        <ProfileForm v-if="itemSelected === 5" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "@/stores/auth/auth";
import ChangePassword from "~/components/change-password-form/change_password.vue";
import PersonalData from "~/components/personal-data/PersonalData.vue";
import {
  UserIcon,
  KeyIcon,
  IdIcon,
  BellIcon,
  LockIcon,
} from "vue-tabler-icons";
import { useI18n } from "vue-i18n";

const windowWidth = ref(window.innerWidth);
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};
const { t } = useI18n();
const isScreenWide = computed(() => windowWidth.value > 900);
const authStore = useAuthStore();
const profileFormData = ref({});
const isStoreReady = ref(false)

const getProfileFormData = (currentUser) => {
  if (currentUser) {
    const { date_of_birth, email, first_name, last_name, profile_image, username } =
      currentUser;
    return { date_of_birth, email, first_name, last_name, profile_image, username };
  }
};

const items = computed(() => [
  { text: t("acc"), icon: UserIcon, id: 0 },
  { text: t("change_password"), icon: KeyIcon, id: 1 },
  { text: t("personal_data"), icon: IdIcon, id: 2 },
  { text: t("alerts_configuration"), icon: BellIcon, id: 3 },
  { text: t("accept_modules"), icon: LockIcon, id: 4 },
]);

onMounted(async () => {
  await authStore.fetchProfile();
  const user = authStore.getProfile;
  profileFormData.value = getProfileFormData(user);
  isStoreReady.value = true
  // window.addEventListener("resize", updateWindowWidth);

});

onUnmounted(() => {
  window.removeEventListener("resize", updateWindowWidth);
});

library.add(faUserSecret);

const itemSelected = ref(0);
const changePadge = (id) => {
  itemSelected.value = id;
};
</script>
<style lang="scss" scoped >
.wrapper {
  display: flex;
  margin-top: 30px;
  margin-left: 70px;
}
.menu {
  margin: 0 20px 0 0;
}
.form {
  width: 80%;
  height: 100%;
  margin-right: 70px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 1%;
}
.inside-form {
  margin-top: 10%;
  margin-bottom: 10%;
  padding: 20px 70px 20px 70px;
}
@media (max-width: 900px) {
  .wrapper {
    margin: 0;
    flex-direction: column;
    align-items: center;
  }
  .menu {
    transform: rotate(-90deg);
  }
  .form {
    margin: 0;
  }
  .inside-form {
    margin-top: 10px;
  }
}
@media (max-width: 700px) {
  .form {
    margin: 0;
  }
  .inside-form {
    padding: 40px;
  }
}

@media (max-width: 450px) {
  .inside-form {
    padding: 20px;
  }
}
</style>