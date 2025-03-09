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

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const selectedYear = inject("selectedYear");
const selectedMonth = inject("selectedMonth");
const selectedLocal = inject("selectedLocal");

const chartData = ref({ labels: [], datasets: [] });
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { beginAtZero: true },
    x: { title: { display: true, text: "Días" } },
  },
});

const fetchData = async () => {
  try {
    const filters = {
      year: selectedYear?.value || new Date().getFullYear(),
      month: selectedMonth?.value || new Date().getMonth() + 1,
      local: selectedLocal?.value || "0",
    };

    const data = await dashboardService.getDailyRevenue(filters);

    if (data && data.days && data.revenue) {
      chartData.value = {
        labels: data.days,
        datasets: [
          {
            label: "Ingresos Diarios",
            data: data.revenue,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            pointBackgroundColor: "#fff",
            pointBorderColor: "rgba(75,192,192,1)",
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "#fff",
          },
        ],
      };
    } else {
      console.error("Datos inválidos:", data);
    }
  } catch (error) {
    console.error("Error al obtener datos:", error);
  }
};


onMounted(fetchData);
watch([selectedYear, selectedMonth, selectedLocal], fetchData);
</script>

<template>
  <div class="chart-container">
    <Line v-if="chartData.labels.length" :data="chartData" :options="chartOptions" />
    <p v-else>Cargando datos...</p>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
