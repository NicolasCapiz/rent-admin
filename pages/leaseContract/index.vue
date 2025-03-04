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
  const url = `http://localhost:3307/leaseContracts/${row.id}/pdf`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Error al obtener el PDF");
    }
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const customTitle = `Contrato ${row.location.name}`; // O el título que prefieras

    // Abrir una nueva ventana en blanco
    const newWindow = window.open("", "_blank");
    if (!newWindow) {
      throw new Error("No se pudo abrir una nueva ventana.");
    }
    // Escribir el HTML en la nueva ventana, incluyendo el título y un iframe que muestre el PDF
    newWindow.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>${customTitle}</title>
        <style>
          html, body { margin: 0; padding: 0; height: 100%; }
          iframe { width: 100%; height: 100%; border: none; }
        </style>
      </head>
      <body>
        <iframe src="${blobUrl}"></iframe>
      </body>
      </html>
    `);
    newWindow.document.close();
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
      baseURL: "http://localhost:3307",
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
  <div class="lease-contracts-container flex h-full w-full flex-col items-center justify-center p-4">
    <Table 
      model="leaseContracts" 
      title="Contratos de Arrendamiento" 
      :head="head" 
      :content="contracts" 
      :actions="actions"
      :reload="reloadTable" 
      class="w-full" 
      @create-lease-contract="openCreateLeaseContractModal"
      @finish-lease-contract="finalizeContract"
      @icon-click="openContractPdf" 
      @selected="handleRowSelection" />
    <!-- Modal para Crear Contrato -->
    <CreateLeaseContractModal v-show="isCreateLeaseContractModalOpen" @close="closeCreateLeaseContractModal"
      @create="createLeaseContract" />
  </div>
</template>

<style scoped>
/* Puedes agregar estilos adicionales para este componente si lo requieres */
</style>
