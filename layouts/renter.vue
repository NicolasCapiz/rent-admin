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
  <div class="renter-container flex w-full max-w-6xl flex-col items-center justify-center">
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
  .renter-container {
    background-color: hsl(var(--card));
    color: hsl(var(--card-foreground));
    border-radius: var(--radius);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid hsl(var(--border));
  }
</style>
