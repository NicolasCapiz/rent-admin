<script setup lang="ts">
import { ref, onMounted, inject, watch } from "vue";
import { Pie } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";
import { dashboardService } from "@/services/dashboardService";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

// Inyectamos los filtros definidos en el Dashboard principal (si se usan)
const selectedYear = inject("selectedYear", ref(new Date().getFullYear()));
const selectedMonth = inject("selectedMonth", ref(new Date().getMonth() + 1));
const selectedLocal = inject("selectedLocal", ref("0"));

// Estado reactivo del gráfico con un valor por defecto
const chartData = ref({
  labels: [],
  datasets: []
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
        text: "Categoría",
      },
    },
  },
});

const fetchData = async () => {
  try {
    // Construimos los filtros (si tu servicio los necesita, de lo contrario, se puede ajustar)
    const filters = {
      year: selectedYear?.value || new Date().getFullYear(),
      month: selectedMonth?.value || (new Date().getMonth() + 1),
      local: selectedLocal?.value || "0",
    };

    const data = await dashboardService.getPaymentStatus(filters);
    console.log("📊 Datos recibidos:", data);

    if (data && data.labels && data.datasets) {
      chartData.value = {
        labels: data.labels,
        datasets: [
          {
            label: "Estado de Pagos",
            data: data.datasets[0].data || [],
            backgroundColor: data.datasets[0].backgroundColor || ["#2196F3", "#FFC107", "#F44336"],
          },
        ],
      };
    } else {
      console.error("🚨 Datos incorrectos para el gráfico", data);
      // Si no llegan datos válidos, asigna un objeto vacío para que el componente deje de mostrar "Cargando datos..."
      chartData.value = { labels: [], datasets: [] };
    }
  } catch (error) {
    console.error("❌ Error al obtener datos del gráfico:", error);
  }
};

onMounted(fetchData);

// Actualizar el gráfico cuando cambien los filtros
if (selectedYear && selectedMonth && selectedLocal) {
  watch([selectedYear, selectedMonth, selectedLocal], async () => {
    await fetchData();
  });
}
</script>

<template>
  <div class="chart-container">
    <h3>💰 Estado de Pagos</h3>
    <Pie v-if="chartData && chartData.labels && chartData.datasets && chartData.datasets.length" :data="chartData" :options="chartOptions" />
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
