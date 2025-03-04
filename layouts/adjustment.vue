<script setup lang="ts">
import { useAuth } from "../composables/useAuth";
import { ref } from "vue";
import Table from "@/components/Table.vue";
import type { HeadTable } from "@/types/headTable";
import type { BodyTable } from "@/types/bodyTable";
import CreateAdjustmentModal from "@/components/modals/CreateAdjustment.vue";
import AffectedLocationsModal from "@/components/modals/AffectedLocations.vue"; // Componente que crearemos
import { useNuxtApp } from "#app"; 
import { nextTick } from "vue";
import { computed } from "vue";

const TYPE_ADJUSTMENT = {
  AMOUNT: 1,
  PERCENTAGE: 2,
};
const STATUS = {
  ACTIVE: 1,
  FINISH: 2
}
const { $notyf } = useNuxtApp(); // Servicio de notificaciones  
const selectedAdjustment = ref<BodyTable | null>(null); // Ajuste seleccionado
const showModal = ref(false); // Controla si el modal está visible
const adjustments = ref<BodyTable[]>([]); // Datos para la tabla
const auth = useAuth();
const token = auth.getToken();
const reloadTable = ref(false); 
const showAffectedModal = ref(false);
const affectedLocations = ref([] as any[]);


// Definimos las columnas de la tabla
const head = ref<HeadTable[]>([
  { title: "Ejecución", key: "lastExecutedAt", type: "date" },
  { title: "Monto", key: "amount", type: "number", isVisible: TYPE_ADJUSTMENT.AMOUNT, keyVisible: 'type' },
  { title: "Porcentaje", key: "amount", type: "number", isVisible: TYPE_ADJUSTMENT.PERCENTAGE, keyVisible: 'type' },
  { title: "Periodo", key: "period", isConstant: true, css: true },
  { title: "Estado", key: "status", isConstant: true, css: true },
  {
    title: "Locales Afectados",
    key: "affectedLocales",
    type: "custom",
    // La función customRender devuelve un resumen:
    customRender: (row: any) =>
      row.applyToAll
        ? "Todos los locales"
        : (row.locations && row.locations.length > 0
            ? `${row.locations.length} locales`
            : "Ninguno"),
  },
]);


const isCreateAdjustmentModalOpen = ref(false);

const openCreateAdjustmentModal = () => {
  isCreateAdjustmentModalOpen.value = true;
};

const closeCreateAdjustmentModal = () => {
  isCreateAdjustmentModalOpen.value = false;
};
const createAdjustment = async () => {
  closeCreateAdjustmentModal()
  reloadTable.value = true;

};
const actions = computed(() => [
  { 
    title: "Crear Ajuste", 
    modal: "adjustment",
    operation: "create"
  },
  {
    title: "Finalizar Aumento",
    operation: "finish",
    modal: "adjustment",
    enabled: !!(selectedAdjustment.value && selectedAdjustment.value.status === STATUS.ACTIVE), 
  },
]);

const finalizeAdjustment = async () => {
  if (!selectedAdjustment.value) return;

  try {
    const response = await $fetch<{ message: string }>(`priceAdjustments/${selectedAdjustment.value.id}/finalize`, {
      method: "PUT",
      baseURL: "http://localhost:3307",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Mostrar notificación de éxito
    $notyf.success(response.message || "Ajuste finalizado correctamente");
    selectedAdjustment.value = null;
    reloadTable.value = true;
  } catch (error: any) {
    console.error("Error al finalizar ajuste:", error);
    
    // Mostrar mensaje de error del backend o genérico
    const errorMessage = error?.data?.message || "No se pudo finalizar el ajuste.";
    $notyf.error(errorMessage);
  }
};

const handleRowSelection = async (row: BodyTable) => {
  selectedAdjustment.value = row;
  await nextTick(); // Espera a que Vue procese el cambio
};

const openAffectedModal = (row: any) => {
  if (row.applyToAll) {
    // Si se aplica a todos, puedes mostrar un mensaje especial o, si lo prefieres, cargar todas las locaciones.
    affectedLocations.value = []; // O mostrar "Todos los locales" en el modal
  } else {
    affectedLocations.value = row.locations || [];
  }
  showAffectedModal.value = true;
};

</script>

<template>
  <div class="adjustment-container flex h-full w-full flex-col items-center justify-center">
    <Table
      model="priceAdjustments"
      title="Aumentos"
      :head="head"
      :content="adjustments"
      :actions="actions"
      :reload="reloadTable"
      class="w-full"
      @create-adjustment="openCreateAdjustmentModal"
      @finish-adjustment="finalizeAdjustment"
      @selected="handleRowSelection"
      @affected-click="openAffectedModal"
    />
    <!-- Modal para Crear Ajuste -->
    <CreateAdjustmentModal
      v-show="isCreateAdjustmentModalOpen"
      @close="closeCreateAdjustmentModal"
      @create="createAdjustment"
    />
    <!-- Modal para Mostrar Locales Afectados -->
    <AffectedLocationsModal
      v-if="showAffectedModal"
      :locations="affectedLocations"
      @close="showAffectedModal = false"
    />
  </div>
</template>


<style scoped>
.adjustments-layout-container {
  background-color: hsl(var(--card));
  color: hsl(var(--card-foreground));
  border-radius: var(--radius);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid hsl(var(--border));
}
</style>