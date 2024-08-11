import { defineStore } from "pinia";
import axios from "@/utils/axios";

export const useProjectsStore = defineStore({
  id: "projects",
  state: () => ({
    projects: [],
    locations: [],
    isLoaded: false,
  }),
  getters: {
    getProjects: (state: any) => state.projects,
    isProjectsLoaded: (state) => state.isLoaded,
  },
  actions: {
    async fetchProjects() {
      try {
        const response = await axios.get("projects/");
        this.projects = response.data;
        // this.isLoaded = true;
      } catch (error) {
        alert(error);
        console.error(error);
      }
    },
    async getProjectById(id: number) {
      try {
        const response = await axios.get(`projects/${id}/`);
        return response.data;
      } catch (error) {
        alert(error);
        console.error(error);
      }
    },
    async addProject(ProjectData: object) {
      try {
        const response = await axios.post("projects/", ProjectData);
        if (response.status === 200 || response.status === 201) {
          return response.data;
        }
      } catch (error) {
        alert(error);
        console.error(error);
      }
    },
    async updateProject(id: number, projectData: object) {
      try {
        const response = await axios.put(
          `/portfolio/projects/${id}/`,
          projectData
        );
        return response.data;
      } catch (error) {
        alert(error);
        console.error(error);
      }
    },
    async patchProject(id: number, projectData: object) {
      try {
        const response = await axios.patch(
          `/portfolio/projects/${id}/`,
          projectData
        );
        return response.data;
      } catch (error) {
        alert(error);
        console.error(error);
      }
    },
    async deleteProject(id: number) {
      try {
        const response = await axios.delete(`/portfolio/projects/${id}/`);
        return response.data;
      } catch (error) {
        alert(error);
        console.error(error);
      }
    },
    async removeEmployeesFromProject(id: number, employeeIds: number) {
      try {
        const response = await axios.patch(
          `/portfolio/projects/${id}/remove-employees/`,
          { employeeIds }
        );
        return response.data;
      } catch (error) {
        alert(error);
        console.error(error);
      }
    },
  },
});
