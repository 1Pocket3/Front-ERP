<template>
    <div class="logo">
		<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#007ACC" />


  <text x="100" y="115" font-family="Arial" font-size="40" fill="white" text-anchor="middle">Logo</text>
</svg>

    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const primary = ref('rgb(var(--v-theme-primary))');
const secondary = ref('rgb(var(--v-theme-secondary))');
</script>
