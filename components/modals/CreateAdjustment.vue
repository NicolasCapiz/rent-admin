<script setup lang="ts">
import { ref, defineEmits, onMounted } from "vue";
import { locationService } from "@/services/locationService";
import { adjustmentService } from "@/services/adjustmentService";
import { useNuxtApp } from "#app";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";

// Emitir eventos
const emit = defineEmits(["close", "create"]);
const { $notyf } = useNuxtApp(); // Servicio de notificaciones

const TYPE_ADJUSTMENT = {
  AMOUNT: 1,
  PERCENTAGE: 2,
};

const PERIODS = [
  { value: 1, label: "Mensual" },
  { value: 2, label: "Bimestral" },
  { value: 4, label: "Trimestral" },
  { value: 8, label: "Semestral" },
  { value: 16, label: "Anual" },
];

// Estado del formulario
const form = ref({
  amount: null,
  type: TYPE_ADJUSTMENT.AMOUNT,
  period: null,
  applyToAll: true,
  selectedLocations: [] as number[], // Solo IDs
});

const locations = ref([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Cambiar el tipo (monto o porcentaje)
const setType = (type: number) => {
  form.value.type = type;
  form.value.amount = null;
};

// Cambiar el modo de aplicación
const setApplyToAll = (applyToAll: boolean) => {
  form.value.applyToAll = applyToAll;
  if (applyToAll) {
    form.value.selectedLocations = [];
  }
};

// Obtener localidades
const fetchLocations = async () => {
  try {
    isLoading.value = true;
    locations.value = await locationService.getAllLocations();
    isLoading.value = false;
  } catch (err) {
    isLoading.value = false;
    error.value = "Error al cargar los locales.";
    console.error(err);
  }
};

// Llamar a fetchLocations al montar
onMounted(fetchLocations);

// Enviar el formulario
const submitForm = async () => {
  try {
    if (!form.value.period) {
      $notyf.error("Debes seleccionar un periodo.");
      return;
    }

    // Enviar solo los IDs de selectedLocations
    const data = {
      amount: form.value.amount,
      type: form.value.type,
      period: form.value.period.value, // Tomar solo el valor numérico
      applyToAll: form.value.applyToAll,
      selectedLocations: form.value.applyToAll
        ? [] 
        : form.value.selectedLocations.map((location) => location.id),
    };

    console.log("Enviando datos:", data);
    
    const response = await adjustmentService.createAdjustment(data);
    emit("create", response);
  } catch (err: any) {
    const errorMessage = err?.data?.message || "Error desconocido al crear el ajuste.";
    console.error("Error al crear ajuste:", err);
    $notyf.error(errorMessage);
  }
};

// Cerrar el modal
const closeModal = () => {
  emit("close");
};
</script>

<template>
  <div class="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center dark:bg-opacity-70 z-[1000]">
    <div class="modal-content bg-muted rounded-lg shadow-lg w-full max-w-md text-modal-foreground">
      <!-- Encabezado con botón de cierre y creación mejorados -->
      <div class="modal-header flex justify-between items-center px-6 py-3 border-b border-border">
        <button
          @click="closeModal"
          class="text-muted-foreground hover:text-primary focus:outline-none cursor-pointer w-auto px-3 py-1"
        >
          Cerrar
        </button>
        <h3 class="text-lg font-semibold flex-grow text-center">Crear Ajuste</h3>
        <button
          @click="submitForm"
          class="bg-primary text-foreground hover:bg-primary-foreground rounded px-6 py-2 font-bold w-auto"
        >
          Crear
        </button>
      </div>

      <div class="modal-body p-4 space-y-4">
        <div>
          <label class="block text-sm font-medium text-muted-foreground">Tipo de Aumento:</label>
          <div class="flex mt-2">
            <button
              :class="[
                'px-4 py-1 font-bold border border-input focus:outline-none w-full',
                form.type === TYPE_ADJUSTMENT.AMOUNT
                  ? 'bg-primary text-foreground hover:bg-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted-foreground',
                'rounded-l-md',
              ]"
              @click="setType(TYPE_ADJUSTMENT.AMOUNT)"
            >
              Monto
            </button>
            <button
              :class="[
                'px-4 py-1 font-bold border border-input focus:outline-none w-full',
                form.type === TYPE_ADJUSTMENT.PERCENTAGE
                  ? 'bg-primary text-foreground hover:bg-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted-foreground',
                'rounded-r-md',
              ]"
              @click="setType(TYPE_ADJUSTMENT.PERCENTAGE)"
            >
              Porcentaje
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-muted-foreground">Monto o Porcentaje:</label>
          <input
            type="number"
            v-model="form.amount"
            placeholder="Ingrese el valor"
            class="mt-1 block w-full border-input rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary bg-background text-foreground"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-muted-foreground">Periodo:</label>
          <multiselect
            v-model="form.period"
            :options="PERIODS"
            label="label"
            track-by="value"
            placeholder="Selecciona periodo"
            class="multiselect"
          />
        </div>

        <div>
  <label class="block text-sm font-medium text-muted-foreground">Aplicar a:</label>
  <div class="flex mt-2">
    <button
      :class="[
        'px-3 py-1.5 text-sm font-bold border border-input focus:outline-none w-full',
        form.applyToAll
          ? 'bg-primary text-foreground hover:bg-primary-foreground'
          : 'bg-muted text-muted-foreground hover:bg-muted-foreground',
        'rounded-l-md',
      ]"
      @click="setApplyToAll(true)"
    >
      Todos los Locales
    </button>
    <button
      :class="[
        'px-3 py-1.5 text-sm font-bold border border-input focus:outline-none w-full',
        !form.applyToAll
          ? 'bg-primary text-foreground hover:bg-primary-foreground'
          : 'bg-muted text-muted-foreground hover:bg-muted-foreground',
        'rounded-r-md',
      ]"
      @click="setApplyToAll(false)"
    >
      Locales Seleccionados
    </button>
  </div>
</div>

        <div v-if="!form.applyToAll">
          <label class="block text-sm font-medium text-muted-foreground">Seleccionar Locales:</label>
          <multiselect
            v-model="form.selectedLocations"
            :options="locations"
            :multiple="true"
            label="name"
            track-by="id"
            placeholder="Selecciona locales"
            class="multiselect"
          />
        </div>
      </div>
    </div>
  </div>
</template>