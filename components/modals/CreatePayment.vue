<!-- components/modals/CreatePaymentModal.vue -->
<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useNuxtApp } from "#app";
import { locationService } from "@/services/locationService";
import { paymentService } from "@/services/paymentService";
import { paymentMethodService } from "@/services/paymentMethodService";
import { rentHistoryService } from "@/services/rentHistoryService";

const emit = defineEmits(["close", "create"]);
const { $notyf } = useNuxtApp();

// Estado del formulario
const form = ref({
  locationId: null,
  paymentMethodId: null,
  amount: 0,
  totalRent: 0,
  remainingAmount: 0,
  day: "",   // Día del mes
  month: "", // Mes en minúsculas (ej: "enero")
  year: "",  // Año numérico
});

// Lista de meses en español
const months = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

// Año mínimo y máximo
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const minYear = currentYear - 10;

// Definir día y mes por defecto
onMounted(async () => {
  form.value.year = currentYear;
  form.value.month = months[currentDate.getMonth()];
  form.value.day = currentDate.getDate().toString();

  try {
    const locs = await locationService.getAllLocations();
    locations.value = locs; // se espera un arreglo con {id, name}
    paymentMethods.value = await paymentMethodService.getAllPaymentMethods();
  } catch (err) {
    console.error("Error cargando datos:", err);
    $notyf.error("Error al cargar datos.");
  }
});

// Listas de opciones
const locations = ref([]);
const paymentMethods = ref([]);
const monthIndex = computed(() => {
  const idx = months.indexOf(form.value.month);
  return idx >= 0 ? idx + 1 : null;
});

// Computar el máximo de días según mes y año seleccionados
const maxDay = computed(() => {
  const year = Number(form.value.year);
  const monthIndex = months.indexOf(form.value.month);
  return monthIndex >= 0 ? new Date(year, monthIndex + 1, 0).getDate() : 31;
});

// Función para consultar RentHistory y actualizar total y restante
const fetchRentHistory = async () => {
  if (!form.value.locationId) return;
  try {
    const response = await rentHistoryService.getRentHistoryByLocation(
      form.value.locationId,
      // form.value.month,
      monthIndex.value,
      form.value.year,
      form.value.day
    );
    if (response) {
      form.value.totalRent = response.rentAmount;
      form.value.remainingAmount = response.remainingAmount;
    } else {
      form.value.totalRent = 0;
      form.value.remainingAmount = 0;
    }
  } catch (err) {
    console.error("Error obteniendo RentHistory:", err);
    form.value.totalRent = 0;
    form.value.remainingAmount = 0;
  }
};

watch(
  () => [form.value.locationId, form.value.month, form.value.year, form.value.day],
  () => fetchRentHistory()
);

const submitForm = async () => {
  if (!form.value.locationId || !form.value.paymentMethodId || form.value.amount <= 0) {
    $notyf.error("Completa todos los campos antes de confirmar.");
    return;
  }
  try {
    const paymentData = {
      locationId: form.value.locationId,
      paymentMethodId: form.value.paymentMethodId,
      amount: form.value.amount,
      day: form.value.day,
      month: monthIndex.value,
      // month: form.value.month,
      year: form.value.year,
    };
    const response = await paymentService.createPayment(paymentData);
    emit("create", response);
    $notyf.success("Pago registrado correctamente.");
  } catch (err) {
    console.error("Error al registrar pago:", err);
    err?.data?.message ? $notyf.error(err.data.message) : $notyf.error("Error al procesar el pago.");
  }
};

const closeModal = () => {
  emit("close");
};
</script>

<template>
  <div class="modal-overlay fixed inset-0 flex items-center justify-center z-[1000]" 
       style="background-color: hsla(var(--modal-foreground), 0.2);">
    <div class="modal-content w-full max-w-md rounded-lg shadow-lg" 
         style="background-color: hsl(var(--modal)); color: hsl(var(--modal-foreground));">
      <!-- Encabezado -->
      <div class="modal-header flex justify-between items-center px-6 py-4 border-b" 
           style="border-color: hsl(var(--border));">
        <button @click="closeModal" class="hover:text-hsl(var(--primary)) focus:outline-none px-3 py-1" 
                style="color: hsl(var(--modal-foreground));">
          Cerrar
        </button>
        <h3 class="text-lg flex-grow text-center">Realizar Pago</h3>
        <button @click="submitForm" class="rounded px-4 py-1 text-sm" 
                style="background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground));">
          Confirmar
        </button>
      </div>

      <!-- Cuerpo del Modal -->
      <div class="modal-body p-4 space-y-4">
        <!-- Filtros de Fecha -->
        <div class="flex space-x-2">
          <div class="flex-1">
            <label class="block text-sm font-medium" style="color: hsl(var(--modal-foreground));">Día:</label>
            <input type="number" v-model="form.day" min="1" :max="maxDay" class="input-field" />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium" style="color: hsl(var(--modal-foreground));">Mes:</label>
            <select v-model="form.month" class="input-field">
              <option v-for="(month, index) in months" :key="index" :value="month">
                {{ month }}
              </option>
            </select>
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium" style="color: hsl(var(--modal-foreground));">Año:</label>
            <input type="number" v-model="form.year" :min="minYear" :max="currentYear" class="input-field" />
          </div>
        </div>

        <!-- Selección de Local -->
        <div>
          <label class="block text-sm font-medium" style="color: hsl(var(--modal-foreground));">Seleccionar Local:</label>
          <select v-model="form.locationId" class="input-field">
            <option v-for="location in locations" :key="location.id" :value="location.id">
              {{ location.name }}
            </option>
          </select>
        </div>

        <!-- Método de Pago -->
        <div>
          <label class="block text-sm font-medium" style="color: hsl(var(--modal-foreground));">Método de Pago:</label>
          <select v-model="form.paymentMethodId" class="input-field">
            <option v-for="method in paymentMethods" :key="method.id" :value="method.id">
              {{ method.name }}
            </option>
          </select>
        </div>

        <!-- Monto a Pagar -->
        <div>
          <label class="block text-sm font-medium" style="color: hsl(var(--modal-foreground));">Monto a Pagar:</label>
          <input type="number" v-model="form.amount" min="0" class="input-field" />
        </div>

        <!-- Información: Monto Restante y Total del Alquiler -->
        <!-- <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium" style="color: hsl(var(--modal-foreground));">Monto Restante:</label>
            <input type="text" v-model="form.remainingAmount" disabled class="input-field cursor-not-allowed" />
          </div>
          <div>
            <label class="block text-sm font-medium" style="color: hsl(var(--modal-foreground));">Total del Alquiler:</label>
            <input type="text" v-model="form.totalRent" disabled class="input-field cursor-not-allowed" />
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-field {
  /* Utilizamos las variables del sistema para el estilo de inputs */
  @apply mt-1 block w-full rounded-md shadow-sm px-3 py-2;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--input));
  color: hsl(var(--foreground));
  height: 2rem;
}
</style>
