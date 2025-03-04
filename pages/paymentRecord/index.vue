<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import Table from "@/components/Table.vue";
import type { HeadTable } from "@/types/headTable";
import type { BodyTable } from "@/types/bodyTable";
import { useNuxtApp } from "#app";
import { useAuth } from "@/composables/useAuth";
import { paymentRecordService } from "@/services/paymentRecordService";

const { $notyf } = useNuxtApp();
const auth = useAuth();
const token = auth.getToken();
const reload = ref(false);

// Filtros con valores por defecto (fecha actual)
const currentDate = new Date();
const selectedYear = ref(currentDate.getFullYear());
const selectedMonth = ref(currentDate.getMonth() + 1); // 1 a 12
const selectedLocal = ref("0"); // "0" indica "Todos los Locales"

// Opciones de años (puedes ajustar según tu aplicación)
const availableYears = ref([2022, 2023, 2024, currentDate.getFullYear()]);

// Lista de locales (se cargarán desde el backend)
const locations = ref<{ id: string; name: string }[]>([]);

// Cargar locales desde el BE y agregar la opción "Todos los Locales"
const loadLocations = async () => {
  try {
    const data = await paymentRecordService.getLocationsList(token);
    locations.value = [{ id: "0", name: "Todos los Locales" }, ...data];
  } catch (error) {
    console.error("Error al cargar locales:", error);
    $notyf.error("Error al cargar locales.");
  }
};

const filters = computed(() => ({
  year: selectedYear.value,
  month: selectedMonth.value,
  local: selectedLocal.value
}));

// Definir las columnas de la tabla de PaymentRecord
const head = ref<HeadTable[]>([
  { title: "Local", key: "locationId", isSelect: true, selectKey: "name", model: "locations" },
  { title: "Mes", key: "month", type: "number" },
  { title: "Año", key: "year", type: "number" },
  { title: "Total Alquiler", key: "totalRent", type: "number" },
  { title: "Total Pagado", key: "totalPaid", type: "number" },
  { title: "Restante", key: "remainingAmount", type: "number" },
]);

// Estado para almacenar los PaymentRecords
const paymentRecords = ref<BodyTable[]>([]);


watch([selectedYear, selectedMonth, selectedLocal], () => {
  console.log('juju reload',reload.value);
  
  reload.value = true;
});

onMounted(async () => {
  await loadLocations();

});

</script>

<template>
  <div class="dashboard-container">
    <h1 class="dashboard-title">📊 Resumen de Pagos Mensuales</h1>

    <!-- Filtros -->
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
          <option v-for="n in 12" :key="n" :value="n">{{ n }}</option>
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

    <!-- Tabla de PaymentRecord -->
    <Table
      model="paymentRecords"
      :head="head"
      :filters="filters"
      :reload.sync="reload"
      @update:reload="value => reload = value"
      class="w-full"
    />
  </div>
</template>

<style scoped>
.dashboard-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  padding: 1rem;
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
</style>
