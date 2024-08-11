import axios from '@/utils/axios';
import { defineStore } from 'pinia';

interface Material {
    id: number;
    name: string;
}

export const useMaterialStore = defineStore({
    id: 'materials',
    state: () => ({
        materials: [] as Material[],
    }),
    getters: {
        getMaterials: (state) => state.materials,
    },
    actions: {
        async fetchMaterials() {
            try {
                const response = await axios.get<Material[]>('/api/warehouse/materials/');
                this.materials = response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async createMaterial(materialData: Material) {
            try {
                const response = await axios.post<Material>('/api/warehouse/materials/', materialData);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async getMaterialById(id: number) {
            try {
                const response = await axios.get<Material>(`/api/warehouse/materials/${id}/`);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async updateMaterial(id: number, materialData: Material) {
            try {
                const response = await axios.put<Material>(`/api/warehouse/materials/${id}/`, materialData);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async patchMaterial(id: number, materialData: Partial<Material>) {
            try {
                const response = await axios.patch<Material>(`/api/warehouse/materials/${id}/`, materialData);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async deleteMaterial(id: number) {
            try {
                const response = await axios.delete(`/api/warehouse/materials/${id}/`);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
    },
});
