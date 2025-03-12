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
  { title: "Dia", key: "day", type: "number" },
  { title: "Mes", key: "month", type: "number" },
  { title: "Año", key: "year", type: "number" },
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
  <div class="payment-container flex h-full w-full flex-col items-center justify-center">
    <Table
      model="payments"
      title="Pagos"
      :head="head"
      :content="payments"
      :actions="actions"
      :reload="reloadTable"
      class="w-full"
      @create-payment="openCreatePaymentModal"
      @selected="handleRowSelection"
    />
    <!-- Modal para Crear Pago -->
    <CreatePaymentModal
      v-show="isCreatePaymentModalOpen"
      @close="closeCreatePaymentModal"
      @create="createPayment"
    />
  </div>
</template>

<style scoped>
</style>