import axios from '@/utils/axios';
import { defineStore } from 'pinia';

interface Workmanship {
    id: number;
    name: string;
}

export const useWorkmanshipStore = defineStore({
    id: 'workmanship',
    state: () => ({
        workmanshipList: [] as Workmanship[],
    }),
    getters: {
        getWorkmanshipList: (state) => state.workmanshipList,
    },
    actions: {
        async fetchWorkmanshipList() {
            try {
                const response = await axios.get<Workmanship[]>('/api/warehouse/workmanship/');
                this.workmanshipList = response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async createWorkmanship(workmanshipData: Workmanship) {
            try {
                const response = await axios.post<Workmanship>('/api/warehouse/workmanship/', workmanshipData);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async getWorkmanshipById(id: number) {
            try {
                const response = await axios.get<Workmanship>(`/api/warehouse/workmanship/${id}/`);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async updateWorkmanship(id: number, workmanshipData: Workmanship) {
            try {
                const response = await axios.put<Workmanship>(`/api/warehouse/workmanship/${id}/`, workmanshipData);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async patchWorkmanship(id: number, workmanshipData: Partial<Workmanship>) {
            try {
                const response = await axios.patch<Workmanship>(`/api/warehouse/workmanship/${id}/`, workmanshipData);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async deleteWorkmanship(id: number) {
            try {
                const response = await axios.delete(`/api/warehouse/workmanship/${id}/`);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
    },
});
