<!-- pages/leaseContract/index.vue -->
<script setup lang="ts">
definePageMeta({
  layout: "leaseContract",
  middleware: "auth",
});

import { ref, computed, nextTick, onMounted } from "vue";
import Table from "@/components/Table.vue";
import type { HeadTable } from "@/types/headTable";
import type { BodyTable } from "@/types/bodyTable";
import CreateLeaseContractModal from "@/components/modals/CreateLeaseContract.vue";
import { useNuxtApp } from "#app";
import { leaseContractService } from "@/services/leaseContractService";
import { useAuth } from "@/composables/useAuth";
import { useRuntimeConfig } from "nuxt/app";

const config = useRuntimeConfig();
const apiURL = config.public.apiBase as string;
const { $notyf } = useNuxtApp();
const selectedContract = ref<BodyTable | null>(null);
const contracts = ref<BodyTable[]>([]);
const reloadTable = ref(false);

const auth = useAuth();
const token = auth.getToken();

// Definir las columnas de la tabla

const head = ref<HeadTable[]>([
  {
    title: "Local",
    key: "locationId",
    model: "locations",
    isSelect: true,
    selectKey: "name",
  },
  {
    title: "Inquilino",
    key: "renterId",
    model: "users",
    isSelect: true,
    selectKey: "firstName",
  },
  {
    title: "Precio Mensual",
    key: "rentAmount",
    type: "number",
  },
  {
    title: "Fecha Inicio",
    key: "startDate",
    type: "date",
  },
  {
    title: "Fecha Fin",
    key: "endDate",
    type: "date",
  },
  { title: "Estado", key: "active", isConstant: true, css: true },
  { title: "Pdf", key: "pdfPath", type: 'icon', icon: 'fas fa-file-pdf'},
]);

// Estado para el modal
const isCreateLeaseContractModalOpen = ref(false);

const openCreateLeaseContractModal = () => {
  isCreateLeaseContractModalOpen.value = true;
};

// Listener para el ícono de PDF: abre el PDF en una nueva pestaña
const openContractPdf = async (row: BodyTable) => {
  const url = `${apiURL}/leaseContracts/${row.id}/pdf`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Elimina "Content-Type"
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener el PDF");
    }

    // Verifica el tipo de contenido
    const contentType = response.headers.get("Content-Type");
    if (!contentType || !contentType.includes("pdf")) {
      throw new Error("La respuesta no es un PDF válido.");
    }

    // Convierte la respuesta en un blob
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    // Abrir en una nueva pestaña
    window.open(blobUrl, "_blank");
  } catch (error) {
    console.error("Error al abrir el PDF:", error);
    $notyf.error("No se pudo abrir el PDF.");
  }
};




const closeCreateLeaseContractModal = () => {
  isCreateLeaseContractModalOpen.value = false;
};

const createLeaseContract = async () => {
  closeCreateLeaseContractModal();
  // Recargar la tabla después de crear el contrato
  reloadTable.value = true;
};

const actions = computed(() => [
  {
    title: "Realizar Contrato",
    modal: "leaseContract",
    operation: "create",
  },
  {
    title: "Finalizar Contrato",
    operation: "finish",
    modal: "leaseContract",
    enabled: !!(selectedContract.value && selectedContract.value.active == true), 
  },
]);

const handleRowSelection = async (row: BodyTable) => {
  selectedContract.value = row;
  await nextTick();
};

const finalizeContract = async () => {
  if (!selectedContract.value) return;

  try {
    const response = await $fetch<{ message: string }>(`leaseContracts/${selectedContract.value.id}/finalize`, {
      method: "PUT",
      baseURL: apiURL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Mostrar notificación de éxito
    $notyf.success(response.message || "Contrato finalizado correctamente");
    selectedContract.value = null;
    reloadTable.value = true;
  } catch (error: any) {
    console.error("Error al finalizar contrato:", error);
    
    // Mostrar mensaje de error del backend o genérico
    const errorMessage = error?.data?.message || "No se pudo finalizar el contrato.";
    $notyf.error(errorMessage);
  }
};

// Cargar los contratos al montar el componente
onMounted(async () => {
  try {
    const data = await leaseContractService.getLeaseContracts();
    contracts.value = data;
  } catch (error) {
    console.error("Error al cargar contratos de arrendamiento", error);
    $notyf.error("Error al cargar contratos de arrendamiento.");
  }
});

</script>

<template>
  <div class="lease-contracts-container flex h-full w-full flex-col items-center justify-start overflow-hidden">
    <!-- Contenedor de la tabla con scroll interno -->
    <div class="table-wrapper w-full h-full overflow-hidden">
      <Table 
        model="leaseContracts" 
        title="Contratos de Arrendamiento" 
        :head="head" 
        :content="contracts" 
        :actions="actions"
        :reload="reloadTable" 
        class="w-full h-full overflow-auto" 
        @create-lease-contract="openCreateLeaseContractModal"
        @finish-lease-contract="finalizeContract"
        @icon-click="openContractPdf" 
        @selected="handleRowSelection" />
    </div>

    <!-- Modal para Crear Contrato -->
    <CreateLeaseContractModal 
      v-show="isCreateLeaseContractModalOpen" 
      @close="closeCreateLeaseContractModal"
      @create="createLeaseContract" />
  </div>
</template>


<style scoped>
.lease-contracts-container {
  height: 100vh; /* O ajusta según el layout */
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  overflow: hidden; /* Evita que la página tenga scroll */
}

</style>
