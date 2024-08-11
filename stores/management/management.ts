// managementStore.ts
import { defineStore } from "pinia";
import axios from "@/utils/axios";

export const useManagementStore = defineStore({
  id: "management",
  state: () => ({
    acquisitions: [],
    statuses: [],
    isLoaded: false,
    statusesLoaded: false,
  }),
  getters: {
    getAcquisitions: (state:any) => state.acquisitions,
    getStatuses: (state:any) => state.statuses,
    isAcquisitionsLoaded: (state) => state.isLoaded,
    isStatusesLoaded: (state) => state.statusesLoaded,
  },
  actions: {
    async fetchAcquisitions() {
      try {
        const response = await axios.get("/management/acquisitions/");
        this.acquisitions = response.data;
        this.isLoaded = true;
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
    async fetchAcquisitionById(id: string) {
      try {
        const response = await axios.get(`/management/acquisitions/${id}/`);
        return response.data;
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
    async createAcquisition(acquisitionData: any) {
      try {
        await axios.post("/management/acquisitions/", acquisitionData);
        // You might want to refresh the acquisitions list after creating a new one
        await this.fetchAcquisitions();
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
    async updateAcquisition(id: string, updatedAcquisitionData: any) {
      try {
        await axios.put(
          `/management/acquisitions/${id}/`,
          updatedAcquisitionData
        );
        // You might want to refresh the acquisitions list after updating one
        await this.fetchAcquisitions();
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
    async patchAcquisition(id: string, patchedAcquisitionData: any) {
      try {
        await axios.patch(
          `/management/acquisitions/${id}/`,
          patchedAcquisitionData
        );
        // You might want to refresh the acquisitions list after patching one
        await this.fetchAcquisitions();
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
    async deleteAcquisition(id: string) {
      try {
        await axios.delete(`/management/acquisitions/${id}/`);
        // You might want to refresh the acquisitions list after deleting one
        await this.fetchAcquisitions();
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
    async fetchStatuses() {
      try {
        const response = await axios.get("/management/statuses/");
        this.statuses = response.data;
        this.statusesLoaded = true;
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
    async fetchStatusById(id: string) {
      try {
        const response = await axios.get(`/management/statuses/${id}/`);
        return response.data;
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
  },
});
