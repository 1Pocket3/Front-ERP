import axios from '@/utils/axios';
import { defineStore } from 'pinia';

interface MaterialCategory {
    id: number;
    name: string;
}

export const useMaterialCategoryStore = defineStore({
    id: 'materialCategories',
    state: () => ({
        materialCategories: [] as MaterialCategory[],
    }),
    getters: {
        getMaterialCategories: (state) => state.materialCategories,
    },
    actions: {
        async fetchMaterialCategories() {
            try {
                const response = await axios.get<MaterialCategory[]>('/api/warehouse/material-categories/');
                this.materialCategories = response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async createMaterialCategory(categoryData: MaterialCategory) {
            try {
                const response = await axios.post<MaterialCategory>('/api/warehouse/material-categories/', categoryData);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async getMaterialCategoryById(id: number) {
            try {
                const response = await axios.get<MaterialCategory>(`/api/warehouse/material-categories/${id}/`);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async updateMaterialCategory(id: number, categoryData: MaterialCategory) {
            try {
                const response = await axios.put<MaterialCategory>(`/api/warehouse/material-categories/${id}/`, categoryData);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async patchMaterialCategory(id: number, categoryData: Partial<MaterialCategory>) {
            try {
                const response = await axios.patch<MaterialCategory>(`/api/warehouse/material-categories/${id}/`, categoryData);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async deleteMaterialCategory(id: number) {
            try {
                const response = await axios.delete(`/api/warehouse/material-categories/${id}/`);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
    },
});
