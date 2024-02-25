<script setup lang="ts">
  import Table from "@/components/Table.vue";
  import type { HeadTable } from "@/types/headTable";
  import type { BodyTable } from "@/types/bodyTable";

  components: {
    Table;
  }
  const { data: renters } = await useFetch(`users/renters`, {
    baseURL: "http://localhost:3307",
  });

  console.log("data", renters);
  const head = ref<HeadTable[]>([
    {
      title: "Nombre",
      key: "firstName",
    },
    {
      title: "Direccion",
      key: "email",
    },
  ]);
</script>
<template>
  <div class="location">
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <h1>acaaaaa {{ renters }}</h1>
      <div
        class="flex-column flex flex-wrap items-center justify-between space-y-4 bg-white pb-4 dark:bg-gray-900 md:flex-row md:space-y-0"
      >
        <label for="table-search" class="sr-only">Search</label>
        <Table :head="head" :content="renters"></Table>
      </div>
    </div>
    <slot />
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
