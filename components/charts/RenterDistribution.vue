<!-- components/charts/RenterDistribution.vue -->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Doughnut } from "vue-chartjs";
import { Chart, registerables } from "chart.js";
import { dashboardService } from "@/services/dashboardService";
import { ChartData } from "@/types/chartData"; // Importar el tipo

Chart.register(...registerables);
const chartData = ref<ChartData>({
  labels: [],
  datasets: [],
});
const loadData = async () => {
  const data = await dashboardService.getRenterDistribution();
  chartData.value = {
    labels: data.renters,
    datasets: [
      {
        data: data.counts,
        backgroundColor: ["#2196F3", "#4CAF50", "#FF9800"],
      },
    ],
  };
};

onMounted(loadData);
</script>

<template>
  <div class="chart-container">
    <h2>🏠 Distribución de Inquilinos</h2>
    <Doughnut :data="chartData" />
  </div>
</template>