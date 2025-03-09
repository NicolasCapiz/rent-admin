<template>
  <div class="dashboard-container">
    <h1 class="dashboard-title">📊 Dashboard de Rentas</h1>

    <!-- 🎛 Filtros -->
    <div class="filters">
      <div class="filter-group">
        <label for="year">Año:</label>
        <select id="year" v-model="selectedYear">
          <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="month">Mes:</label>
        <select id="month" v-model="selectedMonth">
          <option v-for="month in 12" :key="month" :value="month">{{ month }}</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="local">Local:</label>
        <select id="local" v-model="selectedLocal">
          <option v-for="local in locations" :key="local.id" :value="local.id">
            {{ local.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- 📊 Gráficos -->
    <div class="grid-container">
      <div class="card wide"><RevenueChart /></div>
      <div class="card medium"><PriceAdjustmentChart /></div>
      <div class="card medium"><PaymentStatusChart /></div>
      <!-- <div class="card"><OccupancyChart /></div> -->
      <!-- <div class="card"><RenterDistribution /></div> -->
      <!-- <div class="card"><RentComparisonChart /></div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, watch } from "vue";
import RevenueChart from "@/components/charts/RevenueChart.vue";
// import OccupancyChart from "@/components/charts/OccupancyChart.vue";
import PaymentStatusChart from "@/components/charts/PaymentStatusChart.vue";
import PriceAdjustmentChart from "@/components/charts/PriceAdjustmentChart.vue";
// import RenterDistribution from "@/components/charts/RenterDistribution.vue";
// import RentComparisonChart from "@/components/charts/RentComparisonChart.vue";
import { dashboardService } from "@/services/dashboardService";
import { locationService } from "@/services/locationService";

// Estado reactivo para los filtros
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth() + 1); // De 1 a 12
const selectedLocal = ref("0");

// Opciones de años disponibles (puedes ajustarlos según tus necesidades)
const availableYears = ref([2022, 2023, 2024, 2025]);

// Lista de locales desde el backend; se incluye la opción por defecto "Todos los Locales"
const locations = ref<{ id: string; name: string }[]>([]);

// Cargar locales desde el backend y agregar la opción "Todos los Locales"
const loadLocations = async () => {
  try {
    const data = await locationService.getAllLocations();
    // Prepend "Todos los Locales" con id "0"
    locations.value = [{ id: "0", name: "Todos los Locales" }, ...data];
  } catch (error) {
    console.error("⚠️ Error al cargar los locales:", error);
  }
};

// Función para actualizar los datos del dashboard según los filtros
const updateDashboardData = async () => {
  const filters = {
    year: selectedYear.value,
    month: selectedMonth.value,
    local: selectedLocal.value,
  };
  // Llama a cada endpoint del dashboardService para actualizar los gráficos.
  // Estos métodos deben aceptar un objeto de filtros para que el backend sepa cómo filtrar la data.
  // await dashboardService.getRevenue(filters);
  // await dashboardService.getOccupancy(filters);
  // await dashboardService.getPaymentStatus(filters);
  // await dashboardService.getRenterDistribution(filters);
  // await dashboardService.getRentComparison(filters);
};

// Proveer los filtros para que los componentes de gráficos puedan acceder a ellos (si usan inject)
provide("selectedYear", selectedYear);
provide("selectedMonth", selectedMonth);
provide("selectedLocal", selectedLocal);

// Cargar locales y actualizar dashboard al montar el componente
onMounted(async () => {
  await loadLocations();
  await updateDashboardData();
});

// Cada vez que cambie alguno de los filtros, se actualizan los datos del dashboard
watch([selectedYear, selectedMonth, selectedLocal], async () => {
  await updateDashboardData();
});
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}

.dashboard-title {
  font-size: 24px;
  margin-bottom: 10px;
  text-align: center;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 15px;
  padding: 12px 20px;
  background-color: hsl(var(--secondary));
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filters label {
  font-weight: bold;
  color: hsl(var(--secondary-foreground));
  font-size: 14px;
}

.filters select {
  min-width: 120px;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--input));
  color: hsl(var(--foreground));
  font-size: 14px;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.filters select:hover {
  border-color: hsl(var(--primary));
}

.filters select:focus {
  box-shadow: 0 0 0 2px hsl(var(--primary));
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  overflow-y: auto;
}

.card.wide {
  grid-column: span 3;
}
.card.medium {
  grid-column: span 1;
}

.card {
  background-color: hsl(var(--secondary));
  color: hsl(var(--secondary-foreground));
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  max-height: 45vh;
  display: flex;
}
</style>
