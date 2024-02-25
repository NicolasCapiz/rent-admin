<script setup lang="ts">
  import Table from "@/components/Table.vue";
  import type { HeadTable } from "@/types/headTable";
  import type { BodyTable } from "@/types/bodyTable";
  import type { OptionsTable } from "@/types/optionsTable";

  components: {
    Table;
  }
  const { data: locations } = await useFetch(`locations`, {
    baseURL: "http://localhost:3307",
  });

  const head = ref<HeadTable[]>([
    {
      title: "Nombre",
      key: "name",
    },
    {
      title: "Direccion",
      key: "address",
    },
    {
      title: "Inquilino",
      key: "manager",
      model: "users",
      isSelect: true,
      selectKey: "firstName",
    },
    {
      title: "Eliminar",
      option: "delete",
      key: "delete",
    },
    {
      title: "Editar",
      option: "editar",
      key: "edit",
    },
  ]);

  const options = ref<OptionsTable[]>([
    {
      label: "Eliminar",
      key: "delete",
    },
    {
      label: "Editar",
      key: "edit",
    },
  ]);
</script>
<template>
  <div class="location">
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div
        class="flex-column flex flex-wrap items-center justify-between space-y-4 bg-white pb-4 dark:bg-gray-900 md:flex-row md:space-y-0"
      >
        <label for="table-search" class="sr-only">Search</label>
        <Table :head="head" model="locations" :options="options" :content="locations"></Table>
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
