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

</script>

<template>
  <div class="help-container flex h-full w-full flex-col items-center justify-center">
    <h1>helpp</h1>
  </div>
</template>

<style scoped> 
</style>
