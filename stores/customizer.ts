import { defineStore } from "pinia";
import config from '@/config'


export const useCustomizerStore = defineStore({
  id: "customizer",
  state: () => ({
    Sidebar_drawer: config.Sidebar_drawer,
    mini_sidebar: config.mini_sidebar,
    setHorizontalLayout: config.setHorizontalLayout, // Horizontal layout
    actTheme: config.actTheme,
    boxed: config.boxed,
    setBorderCard: config.setBorderCard,
    showAlert: config.showAlert
  }),

  getters: {},
  actions: {
    toggleAlertVisibility() {
      this.showAlert = !this.showAlert; // Метод для переключения видимости алерта
      if (this.showAlert) {
        setTimeout(() => {
          this.showAlert = false; // Спустя 3 секунды скрываем алерт
        }, 3000);
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
