 <template>
  <v-sheet color="white" elevation="0" rounded="lg">
    <v-tabs
      :items="items"
      align-tabs="center"
      color="black"
      height="50"
      slider-color="black"
    >
      <template v-slot:tab="{ item }" >
        <v-tab
          :prepend-icon="item.icon"
          
          class="text-none text1"
          @click="selectItem(item.id)"
        ></v-tab>
      </template>
    </v-tabs>
  </v-sheet>
</template>
<script setup>
const props = defineProps({
  items: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["changeItem"]);

const selectItem = (id) => {
  emit("changeItem", id);
};

</script>
<style lang="scss" scoped>
.text1 {
color: black;
background-color: #fff;
}
</style>