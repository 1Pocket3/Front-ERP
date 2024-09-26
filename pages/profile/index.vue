<template>
  <div class="wrapper">
    <div class="menu">
      <Profile_menu @changeItem="changePadge" />
    </div>
    <div class="form">
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
        <ProfileForm v-if="itemSelected >= 2" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import ChangePassword from "~/components/change-password-form/change_password.vue";
import PersonalData from "~/components/personal-data/PersonalData.vue";
import { useAuthStore } from "@/stores/auth/auth";
import { onMounted } from "vue";

const authStore = useAuthStore();
const profileFormData = ref({
  date_of_birth: "",
  username: "",
  first_name: "",
  email: "",
  last_name: "",
  photo: "",
});

const getProfileFormData = (currentUser) => {
  console.log("Current User:", currentUser);

  if (currentUser) {
    const { date_of_birth, email, first_name, last_name, photo, username } =
      currentUser;
    return { date_of_birth, email, first_name, last_name, photo, username };
  };
};

onMounted(async () => {
  await authStore.fetchProfile();
  const user = authStore.getProfile;
  profileFormData.value = getProfileFormData(user);
  console.log("Mounted form data:", profileFormData);
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
</style>