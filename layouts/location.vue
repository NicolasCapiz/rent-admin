<script setup lang="ts">
  import { ref } from "vue";
  import Table from "@/components/Table.vue";
  import type { HeadTable } from "@/types/headTable";
  import type { BodyTable } from "@/types/bodyTable";

  components: {
    Table;
  }

  const head = ref<HeadTable[]>([
    {
      title: "Nombre",
      key: "name",
    },
    {
      title: "Direccion",
      key: "address",
    },
    // {
    //   title: "Alquiler",
    //   key: "totalRent",
    //   isEditable: false,
    // },
    // {
    //   title: "Pagado",
    //   key: "totalPaid",
    //   isEditable: false,
    //   css: true
    // },
    // {
    //   title: "Falta Pagar",
    //   key: "remainingAmount",
    //   isEditable: false,
    //   css: true
    // },
    {
      title: "Inquilino",
      key: "renterId",
      model: "users",
      isSelect: true,
      selectKey: "firstName",
    },
  ]);

</script>
<template>
  <div class="location h-full w-full">
    <Table
      model="locations"
      title="Locales"
      :head="head"
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
