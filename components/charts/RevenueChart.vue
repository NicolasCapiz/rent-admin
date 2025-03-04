<script setup lang="ts">
import { ref, onMounted, inject, watch } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { dashboardService } from "@/services/dashboardService";

// Define los tipos para Chart.js
interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  pointBackgroundColor: string;
  pointBorderColor: string;
  pointHoverBackgroundColor: string;
  pointHoverBorderColor: string;
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

// Inyectamos los filtros definidos en el Dashboard principal
const selectedYear = inject("selectedYear");
const selectedMonth = inject("selectedMonth");
const selectedLocal = inject("selectedLocal");

// Declaramos chartData con la tipación adecuada
const chartData = ref<ChartData>({ labels: [], datasets: [] });

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
        text: "Dias",
      },
    },
  },
});

const fetchData = async () => {
  try {
    // Construir los filtros a partir de los valores inyectados
    const filters = {
      year: selectedYear ? selectedYear.value : new Date().getFullYear(),
      month: selectedMonth ? selectedMonth.value : new Date().getMonth() + 1,
      local: selectedLocal ? selectedLocal.value : "0",
    };
    const data = await dashboardService.getDailyRevenue(filters);
    console.log("📊 Datos recibidos:", data);
    // Si la respuesta tiene "days" y "revenue", transformamos el objeto:
    if (data && data.days && data.revenue) {
      chartData.value = {
        labels: data.days, // Ejemplo: ["1", "2", ..., "31"]
        datasets: [
          {
            label: "Ingresos Diarios",
            data: data.revenue, // Por ejemplo: [0, 0, ..., 0] o los ingresos correspondientes
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(75, 192, 192, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(75, 192, 192, 1)",
          },
        ],
      };
    } else {
      console.error("❌ Datos no válidos:", data);
    }
  } catch (error) {
    console.error("⚠️ Error al obtener datos del gráfico:", error);
  }
};

onMounted(fetchData);

// Observar cambios en los filtros para actualizar el gráfico
if (selectedYear && selectedMonth && selectedLocal) {
  watch([selectedYear, selectedMonth, selectedLocal], async () => {
    await fetchData();
  });
}
</script>

<template>
  <div class="chart-container">
    <!-- <h3>📊 Ingreso Mensual</h3> -->
    <Line v-if="chartData.labels.length > 0" :data="chartData" :options="chartOptions" />
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
