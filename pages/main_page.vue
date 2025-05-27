<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

// Mock data for marketing analytics
const marketingData = ref({
  trafficSources: {
    labels: ['Google Ads', 'Social Media', 'Email', 'Direct', 'Referral'],
    data: [35, 25, 20, 15, 5]
  },
  clientRegistrations: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [40, 150, 180, 200, 250, 300]
  },
  conversionRates: {
    labels: ['Google Ads', 'Social Media', 'Email', 'Direct', 'Referral'],
    data: [2.5, 3.2, 4.1, 1.8, 2.9]
  }
})

onMounted(() => {
  // Traffic Sources Chart
  new Chart(document.getElementById('trafficChart') as HTMLCanvasElement, {
    type: 'doughnut',
    data: {
      labels: marketingData.value.trafficSources.labels,
      datasets: [{
        data: marketingData.value.trafficSources.data,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Traffic Sources Distribution'
        }
      }
    }
  })

  // Client Registrations Chart
  new Chart(document.getElementById('registrationsChart') as HTMLCanvasElement, {
    type: 'line',
    data: {
      labels: marketingData.value.clientRegistrations.labels,
      datasets: [{
        label: 'New Registrations',
        data: marketingData.value.clientRegistrations.data,
        borderColor: '#36A2EB',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Client Registrations Over Time'
        }
      }
    }
  })

  // Conversion Rates Chart
  new Chart(document.getElementById('conversionChart') as HTMLCanvasElement, {
    type: 'bar',
    data: {
      labels: marketingData.value.conversionRates.labels,
      datasets: [{
        label: 'Conversion Rate (%)',
        data: marketingData.value.conversionRates.data,
        backgroundColor: '#4BC0C0'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Conversion Rates by Source'
        }
      }
    }
  })
})
</script>

<template>
  <div class="dashboard">
    <h1 class="dashboard-title">Marketing Analytics Dashboard</h1>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Visitors</h3>
        <p class="stat-value">15,234</p>
      </div>
      <div class="stat-card">
        <h3>New Registrations</h3>
        <p class="stat-value">1,200</p>
      </div>
      <div class="stat-card">
        <h3>Conversion Rate</h3>
        <p class="stat-value">3.2%</p>
      </div>
      <div class="stat-card">
        <h3>Avg. Session Duration</h3>
        <p class="stat-value">4m 32s</p>
      </div>
    </div>

    <div class="charts-grid">
      <div class="chart-container">
        <canvas id="trafficChart"></canvas>
      </div>
      <div class="chart-container">
        <canvas id="registrationsChart"></canvas>
      </div>
      <div class="chart-container">
        <canvas id="conversionChart"></canvas>
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

.charts-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.chart-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 400px;
  width: 100%;
}
</style>
