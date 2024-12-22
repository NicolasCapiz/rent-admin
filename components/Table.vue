<script setup lang="ts">
  import { computed, ref, onMounted, watch, nextTick } from "vue";
  import type { HeadTable } from "../types/headTable";
  import type { BodyTable } from "../types/bodyTable";
  import { useSelect } from "../composables/useSelect";
  import { useNuxtApp } from "#app";
  import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";

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
  const token = localStorage.getItem("token");
  const setEdited = (row: BodyTable) => {
    row.isEdited = true;
  };

  const isLoading = ref(false);
  const showChanges = ref(false);
  const isEdit = ref(false);
  const activeRow = ref<number | null>(null);
  const isFocused = ref(false);
  const select = useSelect();
  const originalContent = ref<BodyTable[]>([]);
  const tableBody = ref(null);

  const searchQuery = ref("");
  const sortKey = ref<string | null>(null);
  const sortOrder = ref<"asc" | "desc" | null>(null);

  const isLargeScreen = ref(window.innerWidth >= 768);

  window.addEventListener("resize", () => {
    isLargeScreen.value = window.innerWidth >= 768;
  });

  const sortByColumn = (key: string) => {
    if (sortKey.value === key) {
      if (sortOrder.value === "asc") {
        sortOrder.value = "desc";
      } else if (sortOrder.value === "desc") {
        sortKey.value = null;
        sortOrder.value = null;
      } else {
        sortOrder.value = "asc";
      }
    } else {
      sortKey.value = key;
      sortOrder.value = "asc";
    }
    fetchData();
  };

  const isEditedOrNew = computed(() => {
    return props.content.some((row) => row.isEdited || row.isNew);
  });

  const fetchData = async () => {
    isLoading.value = true;
    const query: Record<string, string | undefined> = {};
    if (searchQuery.value) query.search = searchQuery.value;
    if (sortKey.value) query.sortKey = sortKey.value;
    if (sortOrder.value) query.sortOrder = sortOrder.value;

    try {
      const response: any = await $fetch(props.model, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        baseURL: "http://localhost:3307",
        query,
      });
      props.content.splice(0, props.content.length, ...response);
      originalContent.value = JSON.parse(JSON.stringify(props.content));
    } catch (error) {
      console.error("Error al obtener datos:", error);
      $notyf.error("Error al obtener los datos.");
    } finally {
      isLoading.value = false;
    }
  };

  const startEdit = () => {
    isEdit.value = true;
    showChanges.value = true;
    originalContent.value = JSON.parse(JSON.stringify(props.content));
  };

  const cancel = () => {
    props.content.splice(0, props.content.length, ...originalContent.value);
    showChanges.value = false;
    isEdit.value = false;
  };

  const addRow = () => {
    const newRow = { isNew: true } as BodyTable;
    props.content.unshift(newRow);
    nextTick(() => {
      if (tableBody.value) {
        tableBody.value.scrollTop = 0;
      }
    });
  };

  const toggleDelete = (row: BodyTable) => {
    if (row.isNew) {
      const index = props.content.indexOf(row);
      if (index !== -1) props.content.splice(index, 1);
    } else {
      row.isDeleted = !row.isDeleted;
      row.isEdited = true;
    }
  };

  const apply = async () => {
    let updateRows = props.content.filter((row) => row.isEdited || row.isNew || row.isDeleted);
    updateRows = updateRows.map((row) => {
      const { selected, ...cleanedRow } = row;
      if (cleanedRow.date) {
      cleanedRow.date = convertDateToISOWithCurrentTime(cleanedRow.date); // Combina fecha con hora actual
      }
      return cleanedRow;
    });

    try {
      const response: any = await $fetch(props.model, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        baseURL: "http://localhost:3307",
        body: updateRows,
      });

      if (response.status === "success") {
        isEdit.value = false;
        showChanges.value = false;
        await fetchData();
        props.content.forEach((row) => {
          row.isEdited = false;
          row.isNew = false;
          row.isDeleted = false;
        });
        $notyf.success(`Las modificaciones en ${props.title} se han guardado con éxito.`);
      } else {
        $notyf.error(response.message || "Error al actualizar filas");
      }
    } catch (error) {
      console.error("Error de red:", error);
      $notyf.error("Error de conexión con el servidor.");
    }
  };

  onMounted(async () => {
    await fetchData();
    for (const column of props.head) {
      if (column.isSelect && column.model)
        await select.fetchOptions(column.model, isLoading.value, token);
    }
  });

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

  function convertDateToISOWithCurrentTime(date: string): string {
  const now = new Date();
  const [year, month, day] = date.split("-").map(Number);

  const combinedDate = new Date(
    Date.UTC(year, month - 1, day, now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds())
  );

  return combinedDate.toISOString();
}
  const setActiveRow = (rowIndex: number) => {
    activeRow.value = rowIndex;
    isFocused.value = true;
  };

  const clearActiveRow = () => {
    activeRow.value = null;
    isFocused.value = false;
  };

  const markAsEdited = (row: BodyTable) => {
    row.isEdited = true;
  };

  const dropdownPosition = ref("dropdown-below");

  const adjustDropdownPosition = (button) => {
    nextTick(() => {
      const rect = button.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (windowHeight - rect.bottom < 200 && rect.top > 200) {
        dropdownPosition.value = "dropdown-above";
      } else {
        dropdownPosition.value = "dropdown-below";
      }
    });
  };
</script>

<template>
  <div class="flex h-full w-full flex-col">
    <!-- Contenedor adaptable para Título, Editar y Buscar -->
    <div class="flex flex-col gap-2 pb-2 lg:flex-row lg:items-center lg:justify-between">
      <div v-if="!showChanges || isLargeScreen" class="flex w-full items-center justify-between">
        <h2 class="text-lg font-semibold">{{ title }}</h2>
        <button
          v-if="!showChanges && isEditable"
          @click="startEdit"
          class="ml-2 rounded bg-primary px-4 py-2 text-white"
        >
          Editar
        </button>
      </div>

      <div v-if="showChanges" class="flex w-full justify-between space-x-2">
        <button
          @click="addRow"
          class="w-1/3 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700"
        >
          +
        </button>
        <button
          @click="apply"
          :class="[
            'w-1/3 rounded px-4 py-2',
            isEditedOrNew
              ? 'bg-green-500 text-white hover:bg-green-700'
              : 'cursor-not-allowed bg-gray-500 text-white',
          ]"
          :disabled="!isEditedOrNew"
        >
          Aplicar
        </button>
        <button
          @click="cancel"
          class="w-1/3 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700"
        >
          Cancelar
        </button>
      </div>

      <div :class="{ 'w-full': !isLargeScreen }" class="flex lg:w-auto">
        <input
          v-model="searchQuery"
          @input="fetchData"
          placeholder="Buscar..."
          class="search-input flex-grow rounded border bg-muted px-4 py-2 text-white"
        />
      </div>
    </div>

    <!-- Tabla con encabezado fijo y desplazamiento en el cuerpo -->
    <div
      class="table-container relative mx-auto h-full w-full overflow-x-auto lg:overflow-hidden"
    >
      <table class="h-full min-w-full table-auto divide-y divide-border border border-border">
        <thead class="sticky top-0 z-10 bg-muted dark:bg-muted">
          <tr>
            <th scope="col" class="w-8 min-w-0 p-1"></th>
            <th
              v-for="(col, index) in head"
              :key="index"
              scope="col"
              :style="{ width: `${col.width || '150px'}` }"
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white"
              @click="sortByColumn(col.key)"
            >
              <div class="flex cursor-pointer items-center">
                {{ col.title }}
                <span class="arrow" :class="{ active: sortKey === col.key && sortOrder === 'asc' }">
                  ▲
                </span>
                <span
                  class="arrow"
                  :class="{ active: sortKey === col.key && sortOrder === 'desc' }"
                >
                  ▼
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody
  :class="{
      'h-64 flex items-center justify-center': content.length === 0, // Solo cuando no hay datos

    // 'flex items-center justify-center h-64': content.length === 0, // Centrar cuando no hay datos
    // 'bg-background dark:bg-background': content.length > 0, // Normal cuando hay registros
  }"
>
  <tr v-if="content.length === 0" class="text-center w-full">
    <td colspan="100%" class="py-4">
      <i class="fas fa-search"></i> No se encontraron resultados.
    </td>
  </tr>
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
            <td v-for="(value, colIndex) in head" :key="colIndex" class="px-6 py-3">
              <div class="relative">
                <Listbox
                  v-if="!value.option && value.isSelect"
                  v-model="row[value.key]"
                  @update:modelValue="markAsEdited(row)"
                >
                  <ListboxButton
                    class="w-full max-w-[200px] rounded border bg-background p-2 text-foreground"
                    :disabled="!isEdit"
                    @click="adjustDropdownPosition"
                  >
                    {{
                      select.options[value.model]?.find((option) => option.id === row[value.key])?.[
                        value.selectKey
                      ] || "Selecciona una opción"
                    }}
                  </ListboxButton>
                  <ListboxOptions
                    :class="[
                      'absolute z-50 max-h-60 w-full overflow-auto rounded border border-border bg-background shadow-lg',
                      dropdownPosition,
                    ]"
                  >
                    <ListboxOption
                      v-for="option in select.options[value.model]"
                      :key="option.id"
                      :value="option.id"
                      class="cursor-pointer p-2 hover:bg-blue-500 hover:text-white"
                    >
                      {{ option[value.selectKey] }}
                    </ListboxOption>
                  </ListboxOptions>
                </Listbox>
              </div>

              <input
                :type="value.type || 'text'"
                v-if="!value.option && !value.isSelect"
                :disabled="!isEdit"
                class="border-b-2 border-gray-300 bg-transparent dark:border-gray-700 w-100"
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
</template>

<style scoped>
  .table-container {
    overflow-x: auto;
  }

  .arrow {
    border: 1px solid var(--text-color);
    margin-left: 4px;
    width: 12px;
    text-align: center;
    color: rgba(255, 255, 255, 0.4);
  }

  .arrow.active {
    color: rgba(255, 255, 255, 1);
  }


  .search-input {
    width: 100%;
  }

  .dropdown-below {
    top: 100%;
    transform: translateY(0);
  }

  .dropdown-above {
    bottom: 100%;
    transform: translateY(-8px);
  }
  table {
    width: 100%; /* Asegura que la tabla use todo el ancho del contenedor */
    border-collapse: collapse;
  }

  /* Fijar encabezado */
  thead {
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: var(--muted); /* Ajusta según tu diseño */
  }

  /* Altura fija para el cuerpo */
  tbody {
    display: block; /* Permitir scroll solo en el cuerpo */
    overflow-y: auto; /* Scroll vertical para el cuerpo */
    height: inherit;
  }

  /* Ajustar las celdas en tbody */
  tbody tr {
    display: table;
    width: 100%; /* Asegurar que las filas usen todo el ancho */
    table-layout: fixed; /* Distribuir columnas uniformemente */
    
  }

  /* Encabezado para filas */
  thead tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }
  @media (min-width: 768px) {
    .search-input {
      width: auto;
    }
  }
</style>
