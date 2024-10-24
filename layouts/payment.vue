<script setup lang="ts">
  import { ref } from "vue";
  import Table from "@/components/Table.vue";
  import type { HeadTable } from "@/types/headTable";
  import type { BodyTable } from "@/types/bodyTable";

  // Definimos el encabezado de la tabla
  const head = ref<HeadTable[]>([
    {
      title: "Metodo de Pago",
      key: "paymentMethodId",
      model: "paymentMethods",
      isSelect: true,
      selectKey: "name",
    },
    {
      title: "Local",
      key: "locationId",
      model: "locations",
      isSelect: true,
      selectKey: "name",
    },
    {
      title: "Pago",
      key: "amount",
      type: "number",
    },
    {
      title: "Dia",
      key: "date",
      type: "date",
    },
  ]);

  // Estado para almacenar los datos de los inquilinos
  const payments = ref<BodyTable[]>([]);

  // Función para obtener los datos de los inquilinos
  const fetchPayments = async () => {
    try {
      const response = await $fetch<BodyTable[]>("payments", {
        baseURL: "http://localhost:3307",
      });
      payments.value = response;
    } catch (error) {
      console.error(error);
    }
  };

  // Llamamos a la función para obtener los datos al montar el componente
  fetchPayments();
</script>

<template>
  <div class="renter w-full">
    <Table
      model="payments"
      title="Pagos"
      :head="head"
      :content="payments"
      :isEditable="true"
      :add="true"
      :remove="true"
    ></Table>
  </div>
</template>
<style scoped>
  .property {
    border: 1px solid #b9e39e;
    padding: 1rem;
    position: relative;
    background-color: #b8e39e87;
  }
  .property::before {
    content: "layouts/property.vue";
    position: absolute;
    top: 2px;
    left: 5px;
    color: #68b538;
    font-family: monospace;
  }
</style>
