<template>
  <div class="wrapper">
    <div class="menu">
      <Profile_menu />
    </div>
    <div class="form">
      <ProfileForm class="inside-form" />
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faUserSecret);

export default {
  components: {
    FontAwesomeIcon,
  },
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