import { defineStore } from "pinia";
import axios from "@/utils/axios";

export interface Lead {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  company?: string;
  lead_source?: string;
  status: string;
  uploaded_by: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
  assigned_to?: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
  created_at: string;
  updated_at: string;
  full_name: string;
  additional_data?: any;
}

export interface Comment {
  id: number;
  text: string;
  author: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
  author_name: string;
  created_at: string;
  updated_at: string;
}

export interface LeadsResponse {
  results: Lead[];
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export const useLeadsStore = defineStore({
  id: "leads",
  state: () => ({
    leads: [] as Lead[],
    currentLead: null as Lead | null,
    isLoaded: false,
    totalCount: 0,
    currentPage: 1,
    pageSize: 20,
    totalPages: 0,
    currentUser: null as any,
    isAdmin: false,
  }),
  getters: {
    getLeads: (state) => state.leads,
    getCurrentLead: (state) => state.currentLead,
    isLeadsLoaded: (state) => state.isLoaded,
    getTotalCount: (state) => state.totalCount,
    getCurrentPage: (state) => state.currentPage,
    getPageSize: (state) => state.pageSize,
    getTotalPages: (state) => state.totalPages,
    getCurrentUser: (state) => state.currentUser,
    getIsAdmin: (state) => state.isAdmin,
  },
  actions: {
    async fetchLeads(params: {
      search?: string;
      manager_id?: number;
      page?: number;
      page_size?: number;
    } = {}) {
      try {
        const queryParams = new URLSearchParams();
        
        if (params.search) queryParams.append('search', params.search);
        if (params.manager_id) queryParams.append('manager_id', params.manager_id.toString());
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.page_size) queryParams.append('page_size', params.page_size.toString());

        const response = await axios.get(`leads/leads/list/?${queryParams.toString()}`);
        const data: LeadsResponse = response.data;
        
        this.leads = data.results;
        this.totalCount = data.count;
        // Не обновляем currentPage, так как это управляется компонентом
        this.pageSize = data.page_size;
        this.totalPages = data.total_pages;
        this.isLoaded = true;
        
        return data;
      } catch (error) {
        console.error('Error fetching leads:', error);
        throw error;
      }
    },

    async getLeadById(id: number) {
      try {
        const response = await axios.get(`leads/leads/${id}/`);
        this.currentLead = response.data;
        return response.data;
      } catch (error) {
        console.error('Error fetching lead:', error);
        throw error;
      }
    },

    async createLead(leadData: Partial<Lead>) {
      try {
        const response = await axios.post('leads/leads/', leadData);
        if (response.status === 200 || response.status === 201) {
          return response.data;
        }
      } catch (error) {
        console.error('Error creating lead:', error);
        throw error;
      }
    },

    async updateLead(id: number, leadData: Partial<Lead>) {
      try {
        const response = await axios.put(`leads/leads/${id}/`, leadData);
        if (response.status === 200) {
          return response.data;
        }
      } catch (error) {
        console.error('Error updating lead:', error);
        throw error;
      }
    },

    async updateLeadStatus(id: number, status: string) {
      try {
        const response = await axios.patch(`leads/leads/${id}/`, { status });
        if (response.status === 200) {
          // Обновляем локальное состояние при необходимости
          if (this.currentLead && this.currentLead.id === id) {
            this.currentLead.status = response.data.status;
          }
          const idx = this.leads.findIndex(l => l.id === id);
          if (idx !== -1) {
            this.leads[idx] = { ...this.leads[idx], status: response.data.status } as Lead;
          }
          return response.data;
        }
      } catch (error) {
        console.error('Error updating lead status:', error);
        throw error;
      }
    },

    async deleteLead(id: number) {
      try {
        const response = await axios.delete(`leads/leads/${id}/`);
        if (response.status === 200 || response.status === 204) {
          return response.data;
        }
      } catch (error) {
        console.error('Error deleting lead:', error);
        throw error;
      }
    },

    async assignLeads(leadIds: number[], assignedToId: number | null) {
      try {
        const response = await axios.post('leads/leads/assign/', {
          lead_ids: leadIds,
          assigned_to_id: assignedToId
        });
        if (response.status === 200) {
          return response.data;
        }
      } catch (error) {
        console.error('Error assigning leads:', error);
        throw error;
      }
    },

    async importLeads(file: File) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await axios.post('leads/leads/import/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        if (response.status === 201) {
          return response.data;
        }
      } catch (error) {
        console.error('Error importing leads:', error);
        throw error;
      }
    },

    async previewImport(file: File) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await axios.post('leads/leads/import/preview/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        return response.data;
      } catch (error) {
        console.error('Error previewing import:', error);
        throw error;
      }
    },

    async getImportHistory() {
      try {
        const response = await axios.get('leads/leads/import/history/');
        return response.data;
      } catch (error) {
        console.error('Error fetching import history:', error);
        throw error;
      }
    },

    async getManagers() {
      try {
        const response = await axios.get('leads/leads/managers/');
        return response.data;
      } catch (error) {
        console.error('Error fetching managers:', error);
        throw error;
      }
    },

    async getAllUsers() {
      try {
        const response = await axios.get('leads/leads/users/');
        return response.data;
      } catch (error) {
        console.error('Error fetching all users:', error);
        throw error;
      }
    },

    async fetchCurrentUser() {
      console.log('fetchCurrentUser called, currentUser:', this.currentUser);
      
      // Если данные уже есть, возвращаем их
      if (this.currentUser) {
        console.log('Returning cached user data');
        return this.currentUser;
      }
      
      console.log('Fetching user data from API...');
      try {
        const response = await axios.get('leads/leads/me/');
        console.log('User data received:', response.data);
        this.currentUser = response.data;
        this.isAdmin = response.data?.role === 'admin';
        console.log('isAdmin set to:', this.isAdmin);
        return this.currentUser;
      } catch (error) {
        console.error('Error fetching current user:', error);
        throw error;
      }
    },

    // Новые методы для работы с файлами
    async uploadFile(file: File) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await axios.post('leads/upload/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        return response.data;
      } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
    },

    async processImport(importId: number) {
      try {
        const response = await axios.post('leads/process-import/', {
          import_id: importId
        });
        
        if (response.status === 200) {
          return response.data;
        }
      } catch (error) {
        console.error('Error processing import:', error);
        throw error;
      }
    },

    async getImportStatus(importId: number) {
      try {
        const response = await axios.get(`leads/import-status/${importId}/`);
        return response.data;
      } catch (error) {
        console.error('Error fetching import status:', error);
        throw error;
      }
    },

    async getUserImports() {
      try {
        const response = await axios.get('leads/user-imports/');
        return response.data;
      } catch (error) {
        console.error('Error fetching user imports:', error);
        throw error;
      }
    },

    async deleteImport(importId: number) {
      try {
        const response = await axios.delete(`leads/delete-import/${importId}/`);
        if (response.status === 200) {
          return response.data;
        }
      } catch (error) {
        console.error('Error deleting import:', error);
        throw error;
      }
    },

    // ==================== COMMENT METHODS ====================

    async getLeadComments(leadId: number) {
      try {
        const response = await axios.get(`leads/leads/${leadId}/comments/`);
        return response.data;
      } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
      }
    },

    async createComment(leadId: number, text: string) {
      try {
        const response = await axios.post(`leads/leads/${leadId}/comments/create/`, {
          text: text
        });
        if (response.status === 201) {
          return response.data;
        }
      } catch (error) {
        console.error('Error creating comment:', error);
        throw error;
      }
    },

    async updateComment(commentId: number, text: string) {
      try {
        const response = await axios.put(`leads/comments/${commentId}/update/`, {
          text: text
        });
        if (response.status === 200) {
          return response.data;
        }
      } catch (error) {
        console.error('Error updating comment:', error);
        throw error;
      }
    },

    async deleteComment(commentId: number) {
      try {
        const response = await axios.delete(`leads/comments/${commentId}/delete/`);
        if (response.status === 200) {
          return response.data;
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
      }
    },
  },
});
