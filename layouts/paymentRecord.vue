<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import Table from "@/components/Table.vue";
import type { HeadTable } from "@/types/headTable";
import type { BodyTable } from "@/types/bodyTable";
import CreatePaymentModal from "@/components/modals/CreatePayment.vue";
import { useNuxtApp } from "#app";
import { useAuth } from "@/composables/useAuth";

const { $notyf } = useNuxtApp();
const selectedPayment = ref<BodyTable | null>(null);
const showModal = ref(false);
const payments = ref<BodyTable[]>([]);
const auth = useAuth();
const token = auth.getToken();
const reloadTable = ref(false);

// Definimos las columnas de la tabla
const head = ref<HeadTable[]>([
  { title: "Método de Pago",key: "paymentMethodId",isSelect: true, selectKey: "name", model: "paymentMethods"},
  { title: "Local", key: "locationId", isSelect: true, selectKey: "name", model: "locations" },
  { title: "Monto", key: "amount", type: "number" },
  { title: "Fecha", key: "date", type: "date" },
]);

const isCreatePaymentModalOpen = ref(false);

const openCreatePaymentModal = () => {
  isCreatePaymentModalOpen.value = true;
};

const closeCreatePaymentModal = () => {
  isCreatePaymentModalOpen.value = false;
};

const createPayment = async () => {
  closeCreatePaymentModal();
  reloadTable.value = true;
};

const actions = computed(() => [
  {
    title: "Realizar Pago",
    modal: "payment",
    operation: "create",
  },
]);

const handleRowSelection = async (row: BodyTable) => {
  selectedPayment.value = row;
  await nextTick();
};
</script>

<template>
  <div class="payment-container flex h-full w-full flex-col overflow-hidden">
    <!-- Título y acciones -->
    <div class="header-container flex justify-between w-full p-4">
      <h2 class="text-lg font-bold">Pagos</h2>
      <button 
        v-for="action in actions" 
        :key="action.modal" 
        @click="$emit(`${action.operation}-${action.modal}`)"
        class="bg-blue-500 text-white px-4 py-2 rounded">
        {{ action.title }}
      </button>
    </div>

    <!-- Contenedor de la tabla con scroll interno -->
    <div class="table-wrapper flex-grow w-full overflow-hidden">
      <Table
        model="payments"
        :head="head"
        :content="payments"
        :actions="actions"
        :reload="reloadTable"
        class="w-full h-full overflow-auto"
        @create-payment="openCreatePaymentModal"
        @selected="handleRowSelection"
      />
    </div>

    <!-- Modal para Crear Pago -->
    <CreatePaymentModal
      v-show="isCreatePaymentModalOpen"
      @close="closeCreatePaymentModal"
      @create="createPayment"
    />
  </div>
</template>


<style scoped>
.payment-container {
  height: 100vh; /* Toda la altura disponible */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Evita scroll en la página */
}

.header-container {
  flex-shrink: 0; /* Fija el header sin que afecte la tabla */
}

.table-wrapper {
  flex-grow: 1;
  width: 100%;
  overflow: hidden;
  display: flex;
}

.table-wrapper .table-container {
  height: 100%;
  width: 100%;
  overflow-y: auto; /* SOLO la tabla tendrá scroll */
  border-top: 1px solid hsl(var(--border)); /* Opcional: mejorar visual */
}

</style>