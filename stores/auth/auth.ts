import axios from "@/utils/axios";
import { defineStore } from "pinia";

interface Team {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  citizen_id: string;
}

export interface UserResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    teams: [] as Team[],
    users: [] as UserResponse[],
    accessToken: localStorage.getItem("accessToken") || "",
    refreshToken: localStorage.getItem("refreshToken") || "",
    profile: null,
    currentUser: null as any,
    isAdmin: false,
    isCalling: false,
    callingLeadId: null as number | null,
  }),
  getters: {
    getTeams: (state) => state.teams,
    getUsers: (state) => state.users as UserResponse[],
    getAccessToken: (state) => state.accessToken,
    getRefreshToken: (state) => state.refreshToken,
    getProfile: (state) => state.profile,
    getCurrentUser: (state) => state.currentUser,
    getIsAdmin: (state) => state.isAdmin,
    getIsCalling: (state) => state.isCalling,
    getCallingLeadId: (state) => state.callingLeadId,
  },
  actions: {
    async login(loginData: { username: string; password: string }) {
      try {
        const response = await axios.post("/auth/login/", loginData);
        
        // Проверяем, что response.data существует и содержит нужные поля
        if (response.data && response.data.access && response.data.refresh) {
          this.accessToken = response.data.access;
          this.refreshToken = response.data.refresh;
          // console.log('response.status', response);
          localStorage.setItem("accessToken", response.data.access);
          localStorage.setItem("refreshToken", response.data.refresh);
          await this.fetchCurrentUser();
          return response.data;
        } else {
          throw new Error("Invalid response format from server");
        }
      } catch (error: any) {
        console.error('Login error:', error);
        
        // Извлекаем сообщение об ошибке из API ответа
        let errorMessage = "Wrong credentials...";
        
        if (error.response) {
          // Если есть response, пытаемся извлечь сообщение
          errorMessage = error.response.data?.detail || 
                        error.response.data?.message || 
                        error.response.statusText ||
                        `Server error: ${error.response.status}`;
        } else if (error.request) {
          // Если запрос был отправлен, но ответа не было
          errorMessage = "Network error - please check your connection";
        } else {
          // Если ошибка в настройке запроса
          errorMessage = error.message || "An unexpected error occurred";
        }
        
        throw new Error(errorMessage);
      }
    },

    async fetchProfile() {
      try {
        const response = await axios.get("/profile/");
        this.profile = response.data;
      } catch(error) {
        console.log("Eror Profile:", error)
      }
    },

    async refreshAccessToken() {
      try {
        const response = await axios.post("/auth/login/refresh/", {
          refresh: this.refreshToken,
        });
        this.accessToken = response.data.access;
        localStorage.setItem("accessToken", response.data.access);
        return response.data;
      } catch (error: any) {
        const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.message || 
                           error.message || 
                           "Failed to refresh token";
        console.error('Token refresh error:', error);
        throw new Error(errorMessage);
      }
    },
    async logout() {
      try {
        const response = await axios.post("/auth/logout/", {
          refresh: this.refreshToken,
        });
        this.accessToken = "";
        this.refreshToken = "";
        this.currentUser = null;
        this.isAdmin = false;
        this.isCalling = false;
        this.callingLeadId = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigateTo("/auth");
        return response.data;
      } catch (error: any) {
        const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.message || 
                           error.message || 
                           "Failed to logout";
        console.error('Logout error:', error);
        // Даже если logout на сервере не удался, очищаем локальные данные
        this.accessToken = "";
        this.refreshToken = "";
        this.currentUser = null;
        this.isAdmin = false;
        this.isCalling = false;
        this.callingLeadId = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigateTo("/auth");
        throw new Error(errorMessage);
      }
    },
    
    async fetchCurrentUser() {
      console.log('Fetching user data from API...');
      try {
        const response = await axios.get('leads/leads/me/');
        console.log('User data received:', response.data);
        this.currentUser = response.data;
        this.isAdmin = response.data?.role === 'admin';
        console.log('isAdmin set to:', this.isAdmin);
        return this.currentUser;
      } catch (error) {
        console.error('Error fetching current user:', error);
        throw error;
      }
    },

    // Методы для управления состоянием звонка
    setCallingState(isCalling: boolean, leadId: number | null = null) {
      this.isCalling = isCalling;
      this.callingLeadId = leadId;
    },
  },
});
