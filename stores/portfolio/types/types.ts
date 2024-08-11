import axios from "@/utils/axios";
import { defineStore } from "pinia";

export interface Type {
  id: number;
  name: string;
  is_default: boolean;
}

export interface TypesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Type[];
}

export const useTypesStore = defineStore({
  id: "types",
  state: () => ({
    types: {} as TypesResponse, 
  }),
  getters: {
    getTypes: (state) => state.types,
  },
  actions: {
    async fetchTypes() {
      try {
        const response = await axios.get("/types/");
        this.types = response.data;
      } catch (error) {
        alert(error);
        console.error(error);
      }
    },
    async getTypeById(id: number) {
      try {
        const response = await axios.get(`/portfolio/types/${id}/`);
        return response.data;
      } catch (error) {
        alert(error);
        console.error(error);
      }
    },
  },
});
