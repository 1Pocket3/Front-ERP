import { defineStore } from "pinia";
import config from '@/config'
import { LIGHT_THEME, DARK_THEME } from '@/themes'

export const useCustomizerStore = defineStore({
  id: "customizer",
  state: () => ({
    Sidebar_drawer: config.Sidebar_drawer,
    mini_sidebar: config.mini_sidebar,
    setHorizontalLayout: config.setHorizontalLayout, // Horizontal layout
    actTheme: config.actTheme,
    boxed: config.boxed,
    setBorderCard: config.setBorderCard,
    showAlert: config.showAlert,
    alertType: 'success',
    alertMessage: '',
    isDark: false
  }),

  getters: {
    getCurrentTheme: (state) => {
      return state.isDark ? DARK_THEME : LIGHT_THEME;
    },
    getAlertType: (state) => state.alertType,
    getAlertMessage: (state) => state.alertMessage,
  },
  actions: {
    toggleAlertVisibility(type: string = 'success', message: string = '') {
      this.alertType = type;
      this.alertMessage = message;
      this.showAlert = !this.showAlert; // Метод для переключения видимости алерта
      if (this.showAlert) {
        setTimeout(() => {
          this.showAlert = false; // Спустя 3 секунды скрываем алерт
        }, 3000);
      }
    },
    toggleTheme() {
      this.isDark = !this.isDark;
      this.actTheme = this.isDark ? 'DARK_THEME' : 'LIGHT_THEME';
      // Save to localStorage
      if (process.client) {
        localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
      }
    },
    setTheme(theme: 'light' | 'dark') {
      this.isDark = theme === 'dark';
      this.actTheme = this.isDark ? 'DARK_THEME' : 'LIGHT_THEME';
      if (process.client) {
        localStorage.setItem('theme', theme);
      }
    },
    initializeTheme() {
      if (process.client) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
          this.setTheme(savedTheme as 'light' | 'dark');
        }
      }
    },
    SET_SIDEBAR_DRAWER() {
      this.Sidebar_drawer = !this.Sidebar_drawer;
    },
    SET_MINI_SIDEBAR(payload: any) {
      this.mini_sidebar = payload;
    },
    SET_LAYOUT(payload: any) {
      this.setHorizontalLayout = payload;
    },
    SET_THEME(payload: any) {
      this.actTheme = payload;
    },
    SET_CARD_BORDER(payload: any){
      this.setBorderCard = payload
    }
  },
});
