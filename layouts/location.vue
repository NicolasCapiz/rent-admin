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
    {
      title: "Inquilino",
      key: "managerId",
      model: "users",
      isSelect: true,
      selectKey: "firstName",
    },
  ]);

  const locations = ref<BodyTable[]>([]);

  const fetchLocations = async () => {
    try {
      const response = await $fetch<BodyTable[]>("locations", {
        baseURL: "http://localhost:3307",
      });
      locations.value = response;
    } catch (error) {
      console.error(error);
    }
  };

  fetchLocations();
</script>
<template>
  <div class="location w-full">
    <Table
      model="locations"
      title="Locales"
      :head="head"
      :content="locations"
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
