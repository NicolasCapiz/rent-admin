<template>
  <div class="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
    <div class="modal-content bg-muted rounded-lg shadow-lg w-full max-w-md text-modal-foreground">
      <!-- Encabezado del Modal -->
      <div class="modal-header flex justify-between items-center px-6 py-4 border-b border-border">
        <button @click="handleClose" class="text-muted-foreground hover:text-primary focus:outline-none cursor-pointer px-3 py-1">
          Cerrar
        </button>
        <h3 class="text-lg flex-grow text-center">Crear Contrato</h3>
        <button 
          :disabled="!isValid" 
          @click="submitForm" 
          class="bg-primary text-foreground hover:bg-primary-foreground rounded px-4 py-1 text-sm disabled:opacity-50">
          Confirmar
        </button>
      </div>
      <!-- Cuerpo del Modal (scrollable) -->
      <div class="modal-body p-4 space-y-4 max-h-80 overflow-y-auto">
        <!-- Input para seleccionar el PDF -->
        <div>
          <label class="block text-sm font-medium text-muted-foreground">
            Adjuntar Contrato (PDF):
          </label>
          <input ref="fileInput" type="file" accept="application/pdf" @change="handleFileChange" class="input-field file-input" />
        </div>
        <!-- Mostrar los datos extraídos (solo lectura) -->
        <div v-if="tenantName">
          <label class="block text-sm font-medium text-muted-foreground">Concesionario:</label>
          <input type="text" v-model="tenantName" readonly class="input-field" />
        </div>
        <div v-if="tenantDNI">
          <label class="block text-sm font-medium text-muted-foreground">DNI:</label>
          <input type="text" v-model="tenantDNI" readonly class="input-field" />
        </div>
        <div v-if="contractDuration">
          <label class="block text-sm font-medium text-muted-foreground">Tiempo de Contrato (meses):</label>
          <input type="text" v-model="contractDuration" readonly class="input-field" />
        </div>
        <div v-if="monthlyRent">
          <label class="block text-sm font-medium text-muted-foreground">Alquiler Mensual:</label>
          <input type="text" v-model="monthlyRent" readonly class="input-field" />
        </div>
        <div v-if="totalRent">
          <label class="block text-sm font-medium text-muted-foreground">Alquiler Total:</label>
          <input type="text" v-model="totalRent" readonly class="input-field" />
        </div>
        <!-- Si deseas mostrar el nombre del local extraído -->
        <div v-if="localName">
          <label class="block text-sm font-medium text-muted-foreground">Local:</label>
          <input type="text" v-model="localName" readonly class="input-field" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useNuxtApp } from "#app";
import { leaseContractService } from "@/services/leaseContractService";

const emit = defineEmits(["close", "create"]);
const { $notyf } = useNuxtApp();

// Variables reactivas para los datos extraídos del PDF
const tenantName = ref("");
const tenantDNI = ref("");
const contractDuration = ref(""); // en meses, se mostrará como string
const monthlyRent = ref("");      // se mostrará como string
const totalRent = ref("");        // se mostrará como string
const localName = ref("");        // nombre del local, opcional
const tempPdfPath = ref("");        

// Referencia para el input file para poder resetearlo
const fileInput = ref<HTMLInputElement | null>(null);

// La validación se basa en que todos los datos requeridos estén presentes.
const isValid = computed(() => {
  return tenantName.value !== "" &&
         tenantDNI.value !== "" &&
         contractDuration.value !== "" &&
         monthlyRent.value !== "" &&
         totalRent.value !== "";
});

// Resetea todas las variables y el input file
const resetModal = () => {
  tenantName.value = "";
  tenantDNI.value = "";
  contractDuration.value = "";
  monthlyRent.value = "";
  totalRent.value = "";
  localName.value = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// Función para cerrar el modal y limpiar datos
const handleClose = () => {
  resetModal();
  emit("close");
};

// Función para manejar el cambio del archivo
const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  const file = target.files[0];

  // Crear FormData y adjuntar el archivo (clave "file")
  const formData = new FormData();
  formData.append("file", file);

  try {
    // Enviar el archivo al backend para procesar el PDF
    const response = await leaseContractService.processPdf(formData);
    // Asumimos que el response tiene la siguiente estructura:
    // { renterName, renterDni, contractDuration, monthlyRent, totalRent, locationName }
    tenantName.value = response.renterName; // Ya está en minúsculas
    tenantDNI.value = response.renterDni.toString();
    contractDuration.value = response.contractDuration.toString(); // en meses, ej. "12"
    monthlyRent.value = response.monthlyRent.toString();
    totalRent.value = response.totalRent.toString();
    localName.value = response.locationName;
    tempPdfPath.value = response.tempPdfPath;
  } catch (error: any) {
    console.error("Error al procesar el PDF:", error);
    $notyf.error(error.message || "No se pudo analizar el PDF. Verifica el formato.");
    resetModal();
  }
};

// Función para enviar el formulario y crear el contrato en el backend
const submitForm = async () => {
  if (!isValid.value) {
    $notyf.error("Por favor, suba un PDF válido con todos los datos.");
    return;
  }
  try {
    // Preparamos el DTO para crear el contrato; ajusta según lo que espera tu endpoint
    const dto = {
      tenantName: tenantName.value,
      tenantDNI: parseInt(tenantDNI.value, 10),
      contractDuration: parseInt(contractDuration.value, 10), // en meses
      monthlyRent: parseInt(monthlyRent.value, 10),
      totalRent: parseInt(totalRent.value, 10),
      localName: localName.value,
      tempPdfPath: tempPdfPath.value,
    };
    const createdContract = await leaseContractService.createFromPdf(dto);
    $notyf.success("Contrato creado exitosamente.");
    emit("create", createdContract);
    resetModal();
  } catch (error: any) {
    console.error("Error al crear el contrato desde PDF:", error);
    $notyf.error("Error al crear el contrato. Inténtelo nuevamente.");
  }
};
</script>

<style scoped>
.input-field {
  @apply mt-1 block w-full border-input rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary bg-background text-foreground px-3 py-2;
}

.file-input {
  @apply cursor-pointer border border-dashed border-gray-400 p-2 text-center text-sm text-gray-600;
}

.modal-content {
  @apply w-full max-w-md;
}

.modal-body {
  @apply max-h-80 overflow-y-auto;
}
</style>
