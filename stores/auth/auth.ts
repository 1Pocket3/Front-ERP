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
  }),
  getters: {
    getTeams: (state) => state.teams,
    getUsers: (state) => state.users as UserResponse[],
    getAccessToken: (state) => state.accessToken,
    getRefreshToken: (state) => state.refreshToken,
  },
  actions: {
    async login(loginData: { username: string; password: string }) {
      try {
        const response = await axios.post("/auth/login/", loginData);
        this.accessToken = response.data.access;
        this.refreshToken = response.data.refresh;
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
        return response.data;
      } catch (error) {
        alert("Wrong credentials...");
        console.error(error);
        throw error;
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
      } catch (error) {
        alert(error);
        console.error(error);
        throw error;
      }
    },
    async logout() {
      try {
        const response = await axios.post("/auth/logout/", {
          refresh: this.refreshToken,
        });
        this.accessToken = "";
        this.refreshToken = "";
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigateTo("/auth");
        return response.data;
      } catch (error) {
        alert(error);
        console.error(error);
        throw error;
      }
    },
    // Управление командами
    async fetchTeams() {
      try {
        const response = await axios.get<Team[]>("/auth/teams/");
        this.teams = response.data;
      } catch (error) {
        alert(error);
        console.error(error);
      }
    },
    async createTeam(teamData: Team) {
      try {
        const response = await axios.post<Team>("/auth/teams/", teamData);
        return response.data;
      } catch (error) {
        alert(error);
        console.error(error);
      }
    },
    async getTeamById(id: number) {
      try {
        const response = await axios.get<Team>(`/auth/teams/${id}/`);
        return response.data;
      } catch (error) {
        alert(error);
        console.error(error);
      }
    },
    async updateTeam(id: number, teamData: Team) {
      try {
        const response = await axios.put<Team>(`/auth/teams/${id}/`, teamData);
        return response.data;
      } catch (error) {
        alert(error);
        console.error(error);
      }
    },
    async patchTeam(id: number, teamData: Partial<Team>) {
      try {
        const response = await axios.patch<Team>(
          `/auth/teams/${id}/`,
          teamData
        );
        return response.data;
      } catch (error) {
        alert(error);
        console.error(error);
      }
    },
    async deleteTeam(id: number) {
      try {
        const response = await axios.delete(`/auth/teams/${id}/`);
        return response.data;
      } catch (error) {
        alert(error);
        console.error(error);
      }
    },
    async removeEmployeesFromTeam(id: number) {
      try {
        const response = await axios.patch(
          `/auth/teams/${id}/remove-employees/`
        );
        return response.data;
      } catch (error) {
        alert(error);
        console.error(error);
      }
    },
    // Управление пользователями
    async fetchUsers() {
      try {
        const response = await axios.get<UserResponse[]>("managers/");
        this.users = response.data;
      } catch (error) {
        alert(error);
        console.error(error);
      }
    },
    async createUser(userData: User) {
      try {
        const response = await axios.post<User>("/auth/users/", userData);
        return response.data;
      } catch (error) {
        alert(error);
        console.error(error);
      }
    },
    async getUserById(id: number) {
      try {
        const response = await axios.get<User>(`/auth/users/${id}/`);
        return response.data;
      } catch (error) {
        alert(error);
        console.error(error);
      }
    },
    async updateUser(id: number, userData: User) {
      try {
        const response = await axios.put<User>(`/auth/users/${id}/`, userData);
        return response.data;
      } catch (error) {
        alert(error);
        console.error(error);
      }
    },
    async patchUser(id: number, userData: Partial<User>) {
      try {
        const response = await axios.patch<User>(
          `/auth/users/${id}/`,
          userData
        );
        return response.data;
      } catch (error) {
        alert(error);
        console.error(error);
      }
    },
    async getCurrentUser() {
      try {
        const response = await axios.get<User>("/auth/users/current/");
        return response.data;
      } catch (error) {
        alert(error);
        console.error(error);
      }
    },
  },
});
