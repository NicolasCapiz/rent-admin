<script setup lang="ts">
  import { ref } from "vue";
  import Table from "@/components/Table.vue";
  import type { HeadTable } from "@/types/headTable";
  import type { BodyTable } from "@/types/bodyTable";

  // Definimos el encabezado de la tabla
  const head = ref<HeadTable[]>([
    { title: "Nombre", key: "firstName" },
    { title: "Direccion", key: "email" },
  ]);

  // Estado para almacenar los datos de los inquilinos
  const renters = ref<BodyTable[]>([]);

  // Función para obtener los datos de los inquilinos
  const fetchRenters = async () => {
    try {
      const response = await $fetch<BodyTable[]>("users/renters", {
        baseURL: "http://localhost:3307",
      });
      renters.value = response;
    } catch (error) {
      console.error(error);
    }
  };

  // Llamamos a la función para obtener los datos al montar el componente
  fetchRenters();
</script>

<template>
  <div class="renter h-full">
    <Table
      model="users/renters"
      title="Inquilinos"
      :head="head"
      :content="renters"
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
