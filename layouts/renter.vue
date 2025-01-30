<script setup lang="ts">
  import { ref } from "vue";
  import Table from "@/components/Table.vue";
  import type { HeadTable } from "@/types/headTable";
  import type { BodyTable } from "@/types/bodyTable";

  // Definimos el encabezado de la tabla
  const head = ref<HeadTable[]>([
    { title: "Nombre", key: "firstName" },
    { title: "Dirección", key: "email" },
  ]);

  // Estado para almacenar los datos de los inquilinos
  const renters = ref<BodyTable[]>([]);

  const token = localStorage.getItem("token");
  // Función para obtener los datos de los inquilinos
  const fetchRenters = async () => {
    try {
      const response = await $fetch<BodyTable[]>("users/renters", {
        baseURL: "http://localhost:3307",
        headers: { Authorization: `Bearer ${token}` },
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
  <div class="renter-container flex h-full w-full flex-col items-center justify-center">
    <Table
      model="users/renters"
      title="Inquilinos"
      :head="head"
      :content="renters"
      :isEditable="true"
      :add="true"
      :remove="true"
      class="w-full"
    />
  </div>
</template>

<style scoped> 
</style>
