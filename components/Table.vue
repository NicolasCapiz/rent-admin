<script setup lang="ts">
  import type { HeadTable } from "@/types/headTable";
  import type { BodyTable } from "@/types/bodyTable";
  import { useSelect } from "@/composables/useSelect";
  import { ref, onMounted, watch } from "vue";

  const props = defineProps<{
    head: HeadTable[];
    content: BodyTable[];
    model: string;
    isEditable?: boolean;
    add?: boolean;
    remove?: boolean;
  }>();

  const setEdited = (row: BodyTable) => {
    row.isEdited = true;
  };

  // Variables para controlar los estados
  const isLoading = ref(false);
  const showChanges = ref(false);
  const isEdit = ref(false);
  const select = useSelect();
  const originalContent = ref<BodyTable[]>([]);

  const fetchData = async () => {
    isLoading.value = true;
    try {
      const response: any = await $fetch(props.model, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        baseURL: "http://localhost:3307",
      });
      props.content.splice(0, props.content.length, ...response);
      originalContent.value = JSON.parse(JSON.stringify(props.content)); // Guardar el estado original
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const startEdit = () => {
    isEdit.value = true;
    showChanges.value = true;
    originalContent.value = JSON.parse(JSON.stringify(props.content)); // Guardar el estado original
  };

  const cancel = () => {
    // Restaurar el estado original
    props.content.splice(0, props.content.length, ...originalContent.value);
    showChanges.value = false;
    isEdit.value = false;
  };

  const addRow = () => {
    const newRow = {
      isNew: true,
    } as BodyTable;
    props.content.push(newRow);
  };

  const toggleDelete = (row: BodyTable) => {
    row.isDeleted = !row.isDeleted;
  };

  const apply = async () => {
    let updateRows = props.content.filter((row) => row.isEdited || row.isNew || row.isDeleted);
    updateRows = updateRows.map((row) => {
      const { selected, ...cleanedRow } = row;
      return cleanedRow; // Retornar el objeto row sin el campo 'selected'
    });

    try {
      const response: any = await $fetch(props.model, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        baseURL: "http://localhost:3307",
        body: updateRows,
      });

      if (response.status === "success") {
        // Filtrar las filas eliminadas de props.content
        // props.content = props.content.filter((row) => !row.isDeleted);
        isEdit.value = false;
        showChanges.value = false;
        await fetchData(); // Recargar los datos desde el servidor
        props.content.forEach((row) => {
          row.isEdited = false;
          row.isNew = false;
          row.isDeleted = false;
        });
        console.log("Filas actualizadas exitosamente");
      } else {
        console.error("Error al actualizar filas");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  onMounted(async () => {
    await fetchData();
    for (const column of props.head) {
      if (column.isSelect && column.model) await select.fetchOptions(column.model, isLoading);
    }
  });

  // Asegúrate de que cada fila tenga una propiedad "isDeleted", "isEdited" e "isNew"
  watch(
    () => props.content,
    (newContent) => {
      newContent.forEach((row) => {
        if (row.isDeleted === undefined) row.isDeleted = false;
        if (row.isNew === undefined) row.isNew = false;
      });
    },
    { deep: true }
  );
</script>

<template>
  <div class="w-100 overflow">
    <div class="align-items-center m-2 flex justify-between">
      <h2 class="p2 align-self-center">
        {{ model }}
      </h2>

      <div class="flex justify-end">
        <button
          class="m-2 rounded bg-blue-500 px-4 py-2 text-white"
          v-if="!showChanges && isEditable"
          @click="startEdit"
        >
          Editar
        </button>

        <button
          class="m-2 rounded bg-green-500 px-4 py-2 text-white shadow-md hover:bg-green-700"
          v-if="showChanges && add"
          @click="addRow"
        >
          +
        </button>
        <button
          class="m-2 rounded bg-green-500 px-4 py-2 text-white shadow-md hover:bg-green-700"
          v-if="showChanges"
          @click="apply"
        >
          Aplicar
        </button>
        <button
          class="m-2 rounded bg-red-500 px-4 py-2 text-white shadow-md hover:bg-red-700"
          v-if="showChanges"
          @click="cancel"
        >
          Cancelar
        </button>
      </div>
    </div>
    <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
      <thead class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="p-4"></th>
          <th v-for="(row, index) in head" :key="index" scope="col" class="px-6 py-3">
            <span v-if="!row.option">{{ row.title }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in content"
          :key="index"
          class="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
          :class="[
            {
              'bg-red-100 bg-opacity-50': row.isDeleted,
              'bg-green-100 bg-opacity-50': row.isNew,
            },
            {
              'dark:bg-red-700 dark:bg-opacity-50': row.isDeleted,
              'dark:bg-green-700 dark:bg-opacity-50': row.isNew,
            },
          ]"
        >
          <td class="w-4 p-4">
            <div class="flex items-center">
              <button
                v-if="isEdit && remove"
                @click="toggleDelete(row)"
                class="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-700"
              >
                &minus;
              </button>
            </div>
          </td>
          <td v-for="(value, index) in head" :key="index" class="px-6 py-4">
            <select
              v-if="!value.option && value.isSelect"
              v-model="row[value.key]"
              :disabled="!isEdit"
              @change="setEdited(row)"
            >
              <option v-if="isLoading" disabled value="">Cargando...</option>
              <option
                else
                v-for="option of select.options[value.model]"
                :key="option.id"
                :value="option.id"
              >
                {{ option[value.selectKey] }}
              </option>
            </select>
            <input
              v-if="!value.option && !value.isSelect"
              :disabled="!isEdit"
              class="border-b border-gray-300 bg-transparent focus:outline-none"
              v-model="row[value.key]"
              @input="setEdited(row)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
