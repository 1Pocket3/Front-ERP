import axios from '@/utils/axios';
import { defineStore } from 'pinia';

interface WorkmanshipResource {
    id: number;
    name: string;
}

export const useWorkmanshipResourcesStore = defineStore({
    id: 'workmanshipResources',
    state: () => ({
        resources: [] as WorkmanshipResource[],
    }),
    getters: {
        getResources: (state) => state.resources,
    },
    actions: {
        async fetchResources() {
            try {
                const response = await axios.get<WorkmanshipResource[]>('/api/warehouse/workmanship-resources/');
                this.resources = response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async getResourceById(id: number) {
            try {
                const response = await axios.get<WorkmanshipResource>(`/api/warehouse/workmanship-resources/${id}/`);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async updateResource(id: number, resourceData: WorkmanshipResource) {
            try {
                const response = await axios.put<WorkmanshipResource>(`/api/warehouse/workmanship-resources/${id}/`, resourceData);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async patchResource(id: number, resourceData: Partial<WorkmanshipResource>) {
            try {
                const response = await axios.patch<WorkmanshipResource>(`/api/warehouse/workmanship-resources/${id}/`, resourceData);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async deleteResource(id: number) {
            try {
                const response = await axios.delete(`/api/warehouse/workmanship-resources/${id}/`);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
    },
});
