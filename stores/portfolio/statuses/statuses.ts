import axios from "@/utils/axios";
import { defineStore } from "pinia";

export interface Status {
  id: number;
  name: string;
  is_default: boolean;
  color: string;
}

export interface StatusesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Status[];
}

export const useStatusStore = defineStore({
  id: "statuses",
  state: () => ({
    statuses: {} as StatusesResponse,
  }),
  getters: {
    getStatuses: (state) => state.statuses,
  },
  actions: {
    async fetchStatuses() {
      try {
        const response = await axios.get("statuses/");
        this.statuses = response.data;
      } catch (error) {
        alert(error);
        console.error(error);
      }
    },
    async getStatusById(id: number) {
      try {
        const response = await axios.get(`/portfolio/statuses/${id}`);
        return response.data;
      } catch (error) {
        alert(error);
        console.error(error);
      }
    },
  },
});
