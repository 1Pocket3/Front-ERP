 <template>
  <v-card class="mx-auto" max-width="300" max-height="450">
    <v-list density="compact">
      <div class="foto">
        <img class="avatar" src="./avatar.webp" alt="" />
        <button class="btn"><CameraIcon :lazy="true" /></button>
      </div>
      <v-list-item 
      class="list-item"
        v-for="(item, i) in items"
        :key="i"
        :value="item"
        color="primary"
        @active="dsf"
      >
        <div class="items">
          <v-icon :icon="item.icon"></v-icon>
          <v-list-item-title class="item-text">{{
            item.text
          }}</v-list-item-title>
        </div>
      </v-list-item>
    </v-list>
  </v-card>
</template>
<script setup>
const { t } = useI18n();
</script>
<script>
import i18n from "~/plugins/i18n";
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  UserIcon,
  KeyIcon,
  IdIcon,
  BellIcon,
  LockIcon,
  CameraIcon,
} from "vue-tabler-icons";

export default {
  components: {
    CameraIcon,
  },

  data() {
    return {};
  },
  computed: {
    items() {
      return [
        {
          text: this.$t("acc"),
          icon: UserIcon,
        },
        {
          text: this.$t("change_password"),
          icon: KeyIcon,
        },
        {
          text: this.$t("personal_data"),
          icon: IdIcon,
        },
        {
          text: this.$t("alerts_configuration"),
          icon: BellIcon,
        },
        {
          text: this.$t("accept_modules"),
          icon: LockIcon,
        },
      ];
    },
  },
};
</script>
<style scoped>
.icon {
  margin-right: 0;
}
.foto {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}
.avatar {
  width: 60%;
  border-radius: 50%;
}
.items {
  display: flex;
}
.list-item {
  margin: 0 10px;
  border-radius: 50px;
}
.item-text {
  margin-left: 10px;
}
.btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  right: 29%;
  bottom: 5%;
  box-shadow: 0px 3px 10px;
  justify-content: center;
  align-items: center;
  display: flex;
}
</style>