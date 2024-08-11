import axios from '@/utils/axios';
import { defineStore } from 'pinia';

interface MaterialResource {
    id: number;
    name: string;
}

export const useMaterialResourceStore = defineStore({
    id: 'materialResources',
    state: () => ({
        materialResources: [] as MaterialResource[],
    }),
    getters: {
        getMaterialResources: (state) => state.materialResources,
    },
    actions: {
        async fetchMaterialResources() {
            try {
                const response = await axios.get<MaterialResource[]>('/api/warehouse/material-resources/');
                this.materialResources = response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async getMaterialResourceById(id: number) {
            try {
                const response = await axios.get<MaterialResource>(`/api/warehouse/material-resources/${id}/`);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async updateMaterialResource(id: number, resourceData: MaterialResource) {
            try {
                const response = await axios.put<MaterialResource>(`/api/warehouse/material-resources/${id}/`, resourceData);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async patchMaterialResource(id: number, resourceData: Partial<MaterialResource>) {
            try {
                const response = await axios.patch<MaterialResource>(`/api/warehouse/material-resources/${id}/`, resourceData);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async deleteMaterialResource(id: number) {
            try {
                const response = await axios.delete(`/api/warehouse/material-resources/${id}/`);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
    },
});
