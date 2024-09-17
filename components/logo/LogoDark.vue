<template>
    <div class="logo">
      <svg width="200" height="50" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#d0e7ff"/>
  <rect x="10" y="10" width="180" height="30" fill="none" stroke="#5b7fa7" stroke-width="4"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="20" fill="#5b7fa7" font-family="Arial, sans-serif">
    LOGO
  </text>
 
  
</svg>
  

    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const primary = ref('rgb(var(--v-theme-primary))');
const secondary = ref('rgb(var(--v-theme-secondary))');
</script>
