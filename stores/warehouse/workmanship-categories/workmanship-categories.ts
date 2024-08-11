import axios from '@/utils/axios';
import { defineStore } from 'pinia';

interface WorkmanshipCategory {
    id: number;
    name: string;
}

export const useWorkmanshipCategoriesStore = defineStore({
    id: 'workmanshipCategories',
    state: () => ({
        categories: [] as WorkmanshipCategory[],
    }),
    getters: {
        getCategories: (state) => state.categories,
    },
    actions: {
        async fetchCategories() {
            try {
                const response = await axios.get<WorkmanshipCategory[]>('/api/warehouse/workmanship-categories/');
                this.categories = response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async createCategory(categoryData: WorkmanshipCategory) {
            try {
                const response = await axios.post<WorkmanshipCategory>('/api/warehouse/workmanship-categories/', categoryData);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async getCategoryById(id: number) {
            try {
                const response = await axios.get<WorkmanshipCategory>(`/api/warehouse/workmanship-categories/${id}/`);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async updateCategory(id: number, categoryData: WorkmanshipCategory) {
            try {
                const response = await axios.put<WorkmanshipCategory>(`/api/warehouse/workmanship-categories/${id}/`, categoryData);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async patchCategory(id: number, categoryData: Partial<WorkmanshipCategory>) {
            try {
                const response = await axios.patch<WorkmanshipCategory>(`/api/warehouse/workmanship-categories/${id}/`, categoryData);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async deleteCategory(id: number) {
            try {
                const response = await axios.delete(`/api/warehouse/workmanship-categories/${id}/`);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
    },
});
