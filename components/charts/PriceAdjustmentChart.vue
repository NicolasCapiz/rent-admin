<script setup lang="ts">
import { ref, onMounted, watch, inject } from "vue";
import { Bar } from "vue-chartjs";
import { Chart, registerables } from "chart.js";
import { dashboardService } from "@/services/dashboardService";

Chart.register(...registerables);

// Inyectamos los filtros definidos en el Dashboard principal (si están disponibles)
const selectedYear = inject("selectedYear") || ref(new Date().getFullYear());
const selectedLocal = inject("selectedLocal") || ref("0");

const chartData = ref({
  labels: [],
  datasets: [],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
    x: {
      title: {
        display: true,
        text: "Mes",
      },
    },
  },
});

const fetchData = async () => {
  try {
    const filters = {
      year: selectedYear.value,
      local: selectedLocal.value,
    };
    const data = await dashboardService.getPriceAdjustments(filters);
    console.log("📊 Datos de Ajustes de Precio:", data);
    if (data && data.labels && data.datasets) {
      chartData.value = data;
    } else {
      console.error("🚨 Datos incorrectos para Ajustes de Precio", data);
    }
  } catch (error) {
    console.error("❌ Error al obtener datos de Ajustes de Precio:", error);
  }
};

onMounted(fetchData);

// Actualizar datos cada vez que cambien los filtros
watch([selectedYear, selectedLocal], async () => {
  await fetchData();
});
</script>

<template>
  <div class="chart-container">
    <h3>📊 Ajustes de Precio</h3>
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
