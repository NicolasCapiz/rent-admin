<script setup lang="ts">
import { computed, ref, onMounted, watch, nextTick } from "vue";
import type { HeadTable } from "../types/headTable";
import type { BodyTable } from "../types/bodyTable";
import { useSelect } from "../composables/useSelect";
import { useNuxtApp } from "#app";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";

const { $notyf } = useNuxtApp();

const CONSTANT_OPTIONS = {
  period: [
    { value: 1, label: "Mensual" },
    { value: 2, label: "Bimestral" },
    { value: 4, label: "Trimestral" },
    { value: 8, label: "Semestral" },
    { value: 16, label: "Anual" },
  ],
  status: [
    { value: 1, label: "Activo" },
    { value: 2, label: "Finalizado" },
  ],
};

const props = defineProps<{
  head: HeadTable[];
  content: BodyTable[];
  model: string;
  title: string;
  isEditable?: boolean;
  add?: boolean;
  remove?: boolean;
  actions?: { title: string; modal: string; operation: string; enabled?: boolean }[]; // Nueva propiedad para las acciones

}>();
const token = localStorage.getItem("token");
const setEdited = (row: BodyTable) => {
  row.isEdited = true;
};

const isLoading = ref(false);
const showChanges = ref(false);
const isEdit = ref(false);
const activeRow = ref<BodyTable | null>(null); // Nueva variable para almacenar la fila completa

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
const emit = defineEmits(["selected"]);

const setActiveRow = (row: BodyTable) => {
  console.log('row',row);
  
  activeRow.value = row; 

  emit("selected", row);
};

const clearActiveRow = () => {
  activeRow.value = null;

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
        <div class="flex gap-2">
          <!-- Renderizar acciones si se pasan -->
          <button
            v-for="action in actions"
            :key="action.modal"
            @click="$emit(`${action.operation}-${action.modal}`)"
            :class="[
              'bg-blue-500 text-white px-4 py-2 rounded',
              (action.enabled ?? true) ? 'opacity-100 cursor-pointer' : 'opacity-50 cursor-not-allowed'

            ]"            
            
            >
            {{ action.title }}
          </button>

          <button
            v-if="isEditable"
            @click="startEdit"
            class="rounded bg-primary px-4 py-2 text-white"
          >
            Editar
          </button>
        </div>
      </div>

      <div v-if="showChanges" class="flex w-full justify-between space-x-2">
        <button @click="addRow" class="w-1/3 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700">
          +
        </button>
        <button @click="apply" :class="[
          'w-1/3 rounded px-4 py-2',
          isEditedOrNew
            ? 'bg-green-500 text-white hover:bg-green-700'
            : 'cursor-not-allowed bg-gray-500 text-white',
        ]" :disabled="!isEditedOrNew">
          Aplicar
        </button>
        <button @click="cancel" class="w-1/3 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700">
          Cancelar
        </button>
      </div>

      <div :class="{ 'w-full': !isLargeScreen }" class="flex lg:w-auto">
        <input v-model="searchQuery" @input="fetchData" placeholder="Buscar..."
          class="search-input flex-grow rounded border bg-muted px-4 py-2 text-white" />
      </div>
    </div>

    <!-- Tabla con encabezado fijo y desplazamiento en el cuerpo -->
    <div class="table-container relative mx-auto h-full w-full overflow-x-auto lg:overflow-hidden">
      <table class="h-full min-w-full table-auto divide-y divide-border border border-border">
  <thead class="sticky top-0 z-10 bg-muted dark:bg-muted">
    <tr>
      <th scope="col" class="w-8 min-w-0 p-1"></th>
      <th
        v-for="(col, index) in head"
        :key="index"
        scope="col"
        class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white"
        @click="sortByColumn(col.key)"
      >
        <div class="flex items-center">
          {{ col.title }}
          <span class="ml-1" :class="{ active: sortKey === col.key && sortOrder === 'asc' }">▲</span>
          <span class="ml-1" :class="{ active: sortKey === col.key && sortOrder === 'desc' }">▼</span>
        </div>
      </th>
    </tr>
  </thead>
  <tbody>
  <tr
    v-for="(row, rowIndex) in content"
    :key="rowIndex"
    :class="[
      'hover:bg-muted dark:hover:bg-muted',
      {
        'bg-accent dark:bg-accent': activeRow && activeRow.id === row.id,
        'bg-red-100 bg-opacity-50 dark:bg-red-700 dark:bg-opacity-50': row.isDeleted,
        'bg-green-100 bg-opacity-50 dark:bg-green-700 dark:bg-opacity-50': row.isNew,
      },
    ]"
    @click="setActiveRow(row)"
  >
    <td class="p-4 justify-items-center">
      <button
        v-if="isEdit && remove"
        @click="toggleDelete(row)"
        class="hover:bg-destructive-dark flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-white"
      >
        &minus;
      </button>
    </td>
    <td v-for="(column, colIndex) in head" :key="colIndex" class="px-3 py-2 text-left" >
      <!-- Verifica si el campo debe ser visible -->
      <div
        v-if="!column.isVisible || row[column.keyVisible] === column.isVisible"
        

      >
        <!-- Campos para constantes como Periodo y Estado -->
        <div v-if="column.isConstant">
          <Listbox v-model="row[column.key]" @update:modelValue="markAsEdited(row)">
            <ListboxButton 
              class="w-full rounded border bg-background p-2 text-foreground"
              :class="column.css ? `${column.key}-${row[column.key]}` : ''"
              :disabled="!isEdit"  
            >
              {{
                CONSTANT_OPTIONS[column.key]?.find((option) => option.value === row[column.key])?.label ||
                "Seleccionar"
              }}
            </ListboxButton>
            <ListboxOptions 
              v-if="isEdit"  
              class="absolute z-50 max-h-60 w-full overflow-auto rounded border border-border bg-background shadow-lg"
            >
              <ListboxOption
                v-for="option in CONSTANT_OPTIONS[column.key] || []"
                :key="option.value"
                :value="option.value"
                class="cursor-pointer p-2 hover:bg-primary hover:text-white"
              >
                {{ option.label }}
              </ListboxOption>
            </ListboxOptions>
          </Listbox>
        </div>

        <!-- Campos para Selects Personalizados -->
        <div v-else-if="column.isSelect">
          <Listbox v-model="row[column.key]" @update:modelValue="markAsEdited(row)">
            <ListboxButton 
              class="w-full rounded border bg-background p-2 text-foreground"
              :class="column.css ? `${column.key}-${row[column.key]}` : ''"

              :disabled="!isEdit"  
            >
              {{
                select.options[column.model]?.find((option) => option.id === row[column.key])?.[column.selectKey] ||
                "Seleccionar"
              }}
            </ListboxButton>
            <ListboxOptions 
              v-if="isEdit"  
              class="absolute z-50 max-h-60 w-full overflow-auto rounded border border-border bg-background shadow-lg"
            >
              <ListboxOption
                v-for="option in select.options[column.model] || []"
                :key="option.id"
                :value="option.id"
                class="cursor-pointer p-2 hover:bg-primary hover:text-white"
              >
                {{ option[column.selectKey] }}
              </ListboxOption>
            </ListboxOptions>
          </Listbox>
        </div>

        <!-- Campos de entrada normales -->
        <div v-else>
          <input
            :type="column.type || 'text'"
            v-model="row[column.key]"
            class="border-b-2 border-gray-300 bg-transparent dark:border-gray-700 w-full"
            :class="column.css ? `${column.key}-${row[column.key]}` : ''"
            :disabled="!isEdit" 
            @input="markAsEdited(row)"
          />
        </div>
      </div>
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
  width: 100%;
  /* Asegura que la tabla use todo el ancho del contenedor */
  border-collapse: collapse;
}

/* Fijar encabezado */
thead {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: var(--muted);
  /* Ajusta según tu diseño */
}

/* Altura fija para el cuerpo */
tbody {
  display: block;
  /* Permitir scroll solo en el cuerpo */
  overflow-y: auto;
  /* Scroll vertical para el cuerpo */
  height: inherit;
}

/* Ajustar las celdas en tbody */
tbody tr {
  display: table;
  width: 100%;

  height: 40px; /* Ajusta según sea necesario */

  /* Asegurar que las filas usen todo el ancho */
  table-layout: fixed;
  /* Distribuir columnas uniformemente */

}

/* Encabezado para filas */
thead tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}

td:first-child, th:first-child {
  width: 50px; /* Define un ancho pequeño */
  min-width: 50px;
  padding: 8px; /* Reduce el padding */
  text-align: center;
}


@media (min-width: 768px) {
  .search-input {
    width: auto;
  }
}
</style>
