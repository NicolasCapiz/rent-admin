<script setup lang="ts">
  import { ref } from "vue";
  import Table from "@/components/Table.vue";
  import type { HeadTable } from "@/types/headTable";
  import type { BodyTable } from "@/types/bodyTable";

  // Definimos el encabezado de la tabla
  const head = ref<HeadTable[]>([
    { title: "Fecha de Ejecución", key: "executionDate", type: "date" },
    { title: "Monto", key: "amount", type: "number" },
    { title: "Porcentaje", key: "percentage", type: "number" },
    { title: "Periodo", key: "period" },
    { title: "Estado", key: "status" },
  ]);

  // Estado para almacenar los datos de los ajustes
  const adjustments = ref<BodyTable[]>([]);

  const token = localStorage.getItem("token");
  
  // Función para obtener los datos de los ajustes
  const fetchAdjustments = async () => {
    try {
      const response = await $fetch<BodyTable[]>("price-adjustments", {
        baseURL: "http://localhost:3307",
        headers: { Authorization: `Bearer ${token}` },
      });
      adjustments.value = response;
    } catch (error) {
      console.error(error);
    }
  };

  // Llamamos a la función para obtener los datos al montar el componente
  fetchAdjustments();
</script>

<template>
  <div class="adjustment-container flex h-full w-full flex-col items-center justify-center">
    <Table
      model="price-adjustments"
      title="Aumentos"
      :head="head"
      :content="adjustments"
      :isEditable="true"
      :add="true"
      :remove="true"
      class="w-full"
    />
  </div>
</template>

<style scoped>
  .adjustment-container {
    background-color: hsl(var(--card));
    color: hsl(var(--card-foreground));
    border-radius: var(--radius);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid hsl(var(--border));
  }
</style>