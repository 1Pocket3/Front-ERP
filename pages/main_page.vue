<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth/auth';

const authStore = useAuthStore();

onMounted(async () => {
  // console.log('Main page mounted, loading user data...');
  // Загружаем данные пользователя при входе на главную страницу
  // try {
  //   const user = await authStore.fetchCurrentUser();
  //   console.log('User loaded on main page:', user);
  // } catch (error) {
  //   console.error('Error fetching current user:', error);
  // }
});
</script>

<template>
  <div class="dashboard">
    <h1 class="dashboard-title">Leads Management Dashboard</h1>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Leads</h3>
        <p class="stat-value">1,234</p>
      </div>
      <div class="stat-card">
        <h3>New Leads Today</h3>
        <p class="stat-value">45</p>
      </div>
      <div class="stat-card">
        <h3>Assigned Leads</h3>
        <p class="stat-value">892</p>
      </div>
      <div class="stat-card">
        <h3>Unassigned Leads</h3>
        <p class="stat-value">342</p>
      </div>
    </div>

    <div class="quick-actions">
      <h2>Quick Actions</h2>
      <div class="actions-grid">
        <v-card class="action-card" @click="navigateTo('/leads')">
          <v-card-text class="text-center">
            <v-icon size="48" color="primary" class="mb-2">mdi-account-group</v-icon>
            <h3>Manage Leads</h3>
            <p>View, add and edit leads</p>
          </v-card-text>
        </v-card>
        
        <v-card class="action-card" @click="navigateTo('/add-lead')">
          <v-card-text class="text-center">
            <v-icon size="48" color="success" class="mb-2">mdi-account-plus</v-icon>
            <h3>Add Lead</h3>
            <p>Create a new lead in the system</p>
          </v-card-text>
        </v-card>
        
        <v-card class="action-card" @click="navigateTo('/profile')">
          <v-card-text class="text-center">
            <v-icon size="48" color="info" class="mb-2">mdi-account-cog</v-icon>
            <h3>Profile Settings</h3>
            <p>Manage your profile settings</p>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;

  h3 {
    color: #666;
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }

  .stat-value {
    color: #2c3e50;
    font-size: 1.5rem;
    font-weight: bold;
  }
}


.quick-actions {
  margin: 2rem 0;
  
  h2 {
    color: #2c3e50;
    margin-bottom: 1.5rem;
    text-align: center;
  }
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.action-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  h3 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #666;
    font-size: 0.9rem;
  }
}
</style>
