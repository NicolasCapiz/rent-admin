<script setup lang="ts">
  import { computed, ref, onMounted, watch } from "vue";
  import type { HeadTable } from "../types/headTable";
  import type { BodyTable } from "../types/bodyTable";
  import { useSelect } from "../composables/useSelect";
  import { useNuxtApp } from "#app";

  const { $notyf } = useNuxtApp();

  const props = defineProps<{
    head: HeadTable[];
    content: BodyTable[];
    model: string;
    title: string;
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
  const activeRow = ref<number | null>(null); // Para rastrear la fila activa
  const isFocused = ref(false); // Para rastrear si un campo está enfocado
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
    props.content.unshift(newRow); // Cambiado a unshift para agregar al principio
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
        isEdit.value = false;
        showChanges.value = false;
        await fetchData(); // Recargar los datos desde el servidor
        props.content.forEach((row) => {
          row.isEdited = false;
          row.isNew = false;
          row.isDeleted = false;
        });
        $notyf.success(`Las modificaciones en ${props.title} se han guardado con éxito.`);
      } else {
        $notyf.error("Error al actualizar filas");
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

  // Funciones para manejar la fila activa
  const setActiveRow = (rowIndex: number) => {
    activeRow.value = rowIndex;
    isFocused.value = true;
  };

  const clearActiveRow = () => {
    activeRow.value = null;
    isFocused.value = false;
  };

  // Computed property para el estado del botón "Aplicar"
  const isEditedOrNew = computed(() => {
    return props.content.some((row) => row.isEdited || row.isNew);
  });
</script>

<template>
  <div class="flex h-full w-full flex-col">
    <div class="flex justify-between p-2">
      <h2 class="self-center">{{ title }}</h2>
      <div class="flex justify-end">
        <button
          class="m-2 rounded bg-primary px-4 py-2 text-white"
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
          :class="[
            'm-2 rounded px-4 py-2 shadow-md',
            isEditedOrNew
              ? 'bg-green-500 text-white hover:bg-green-700'
              : 'cursor-not-allowed bg-gray-500 text-white',
          ]"
          :disabled="!isEditedOrNew"
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

    <div class="custom-scrollbar relative flex-1 overflow-x-auto">
      <div class="inline-block h-full min-w-full align-middle">
        <div class="flex h-full flex-col border border-border shadow sm:rounded-lg">
          <div class="overflow-hidden">
            <table class="min-w-full divide-y divide-border">
              <thead class="bg-muted dark:bg-muted">
                <tr>
                  <th scope="col" class="p-4"></th>
                  <th
                    v-for="(row, index) in head"
                    :key="index"
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    <span v-if="!row.option">{{ row.title }}</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border bg-background dark:bg-background">
                <tr
                  v-for="(row, rowIndex) in content"
                  :key="rowIndex"
                  :class="[
                    'hover:bg-muted dark:hover:bg-muted',
                    {
                      'bg-accent dark:bg-accent': isFocused && activeRow === rowIndex,
                      'bg-red-100 bg-opacity-50 dark:bg-red-700 dark:bg-opacity-50': row.isDeleted,
                      'bg-green-100 bg-opacity-50 dark:bg-green-700 dark:bg-opacity-50': row.isNew,
                    },
                  ]"
                >
                  <td class="w-8 p-4">
                    <div class="flex items-center">
                      <button
                        v-if="isEdit && remove"
                        @click="toggleDelete(row)"
                        class="hover:bg-destructive-dark flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-white"
                      >
                        &minus;
                      </button>
                    </div>
                  </td>
                  <td v-for="(value, colIndex) in head" :key="colIndex" class="px-6 py-4">
                    <select
                      v-if="!value.option && value.isSelect"
                      v-model="row[value.key]"
                      :disabled="!isEdit"
                      @focus="setActiveRow(rowIndex)"
                      @blur="clearActiveRow"
                      @change="setEdited(row)"
                      class="border-none bg-transparent focus:outline-none focus:ring-0"
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
                      :type="value.type || 'text'"
                      v-if="!value.option && !value.isSelect"
                      :disabled="!isEdit"
                      class="border-b-2 border-gray-300 bg-transparent dark:border-gray-700"
                      v-model="row[value.key]"
                      @focus="setActiveRow(rowIndex)"
                      @blur="clearActiveRow"
                      @input="setEdited(row)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* Estilo personalizado para el scroll */
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    border: 2px solid transparent;
    background-clip: content-box;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    border: none;
  }
</style>
