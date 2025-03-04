<!-- components/charts/OccupancyChart.vue -->
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Bar } from "vue-chartjs";
import { Chart, registerables } from "chart.js";
import { dashboardService } from "@/services/dashboardService";
import { ChartData } from "@/types/chartData"; // Importar el tipo

Chart.register(...registerables);

// Inicialización con valores vacíos para evitar errores
const chartData = ref<ChartData>({
  labels: [],
  datasets: [],
});

// Opciones del gráfico (opcional, pero recomendado)
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
});

const loadData = async () => {
  try {
    const data = await dashboardService.getOccupancy();
    console.log("📊 Datos de Ocupación recibidos:", data);

    if (data?.locations && data?.percentages) {
      chartData.value = {
        labels: data.locations,
        datasets: [
          {
            label: "Ocupación",
            data: data.percentages,
            backgroundColor: "#FFC107",
          },
        ],
      };
    } else {
      console.error("🚨 Error: Datos inválidos recibidos:", data);
    }
  } catch (error) {
    console.error("❌ Error al cargar datos de ocupación:", error);
  }
};

onMounted(loadData);

// Para depuración: observar cambios en `chartData`
watch(chartData, (newData) => {
  console.log("🔄 Nuevo chartData para Ocupación:", newData);
});
</script>

<template>
  <div class="chart-container">
    <h2>🏢 Ocupación de Locales</h2>
    <Bar v-if="chartData.labels.length > 0" :data="chartData" :options="chartOptions" />
    <p v-else>Cargando datos...</p>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>