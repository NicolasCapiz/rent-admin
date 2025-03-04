<!-- components/charts/RentComparisonChart.vue -->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Radar } from "vue-chartjs";
import { Chart, registerables } from "chart.js";
import { dashboardService } from "@/services/dashboardService";
import { ChartData } from "@/types/chartData"; // Importar el tipo

Chart.register(...registerables);



// Inicializa chartData con el tipo correcto
const chartData = ref<ChartData>({
  labels: [],
  datasets: [],
});

const loadData = async () => {
  const data = await dashboardService.getRentComparison();

  chartData.value = {
    labels: data.locations,
    datasets: [
      {
        label: "Costo del Alquiler",
        data: data.rents,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(54, 162, 235, 1)",
      },
    ],
  };
};

onMounted(loadData);
</script>

<template>
  <div class="chart-container">
    <h2>📈 Comparación de Rentas</h2>
    <Radar :data="chartData" />
  </div>
</template>