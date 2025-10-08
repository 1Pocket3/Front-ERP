<script setup>
// Иконки теперь используются через mdi

const props = defineProps({ item: Object });
</script>

<template>
    <v-list-subheader  class="smallCap text-uppercase text-subtitle-2 mt-5 font-weight-bold d-flex align-items-center">
        <span class="mini-icon"><v-icon size="16" class="iconClass">mdi-dots-horizontal</v-icon></span>
       <span class="mini-text calibrate">{{ $t(props.item.header) }}</span> 
    </v-list-subheader>
</template>


<style scoped>
.calibrate {
    font-size: 12px;
}
</style>