 <template>
  <v-card class="card">
    <v-list class="list" >
      <div class="foto">
        <img class="avatar" src="./avatar.webp" alt="" />
        <button class="btn"><CameraIcon class="icon" :lazy="true" /></button>
      </div>
      <v-list-item
        class="list-item"
        v-for="(item, i) in items"
        :key="i"
        :value="item"
        color="primary"
        @click="selectItem(item.id)"
      >
        <div class="items">
          <v-icon :icon="item.icon" class="item-icon"></v-icon>
          <v-list-item-title class="item-text">{{
            item.text
          }}</v-list-item-title>
        </div>
      </v-list-item>
    </v-list>
  </v-card>
</template>
<script setup>
import { CameraIcon } from "vue-tabler-icons";

const emit = defineEmits(["changeItem"]);
const selectItem = (id) => {
  emit("changeItem", id);
};
const props = defineProps({
  items: {
    type: Object,
    required: true,
  },
});


</script>
<style scoped>

.card {
  max-width: 300px; 
  max-height: 450px;
}
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

@media (max-width: 900px) { 
  .card {
    display: flex;
    flex-direction: row;
    max-width: 80px;
  }
  .item-icon {
    transform: rotate(90deg);
  }
  .item-text {
    display: none;
  }
  
  .icon {
    width: 50%;
  }
  .foto {
    display: none;
  }
  .btn {
    display: none;
    width: 10px;
    height: 10px;
  }
  
}

</style>