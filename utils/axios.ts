import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError } from "axios"

const axiosServices: AxiosInstance = axios.create({
  // baseURL: process.env.API_BASE_URL || 'https://api.inamstro.alsodev.com/api'
  baseURL: process.env.API_BASE_URL || 'http://192.168.2.126:8000/',

});


axiosServices.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosServices.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      // Redirect to login page or handle authentication failure as per your app's logic
      return navigateTo('/auth')
    }
    return Promise.reject(error);
  }
);

export default axiosServices;