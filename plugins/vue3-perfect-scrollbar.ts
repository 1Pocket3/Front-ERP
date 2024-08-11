import { defineNuxtPlugin } from '#app';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import 'vue3-perfect-scrollbar/style.css';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('PerfectScrollbar', PerfectScrollbar);
});
