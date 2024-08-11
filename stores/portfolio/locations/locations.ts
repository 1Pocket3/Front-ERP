import axios from '@/utils/axios';
import { defineStore } from 'pinia';

export const useLocationStore = defineStore({
    id: 'locations',
    state: () => ({
        locations: [],
    }),
    getters: {
        getLocations: (state) => state.locations,
    },
    actions: {
        async fetchLocations() {
            try {
                const response = await axios.get('/portfolio/locations/');
                this.locations = response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
        async getLocationById(id:number) {
            try {
                const response = await axios.get(`/portfolio/locations/${id}/`);
                return response.data;
            } catch (error) {
                alert(error);
                console.error(error);
            }
        },
    },
});
