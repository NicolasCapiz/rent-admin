<script setup lang="ts">
import { parseISO, format } from "date-fns";
import { useAuth } from "../composables/useAuth";
import { computed, ref, onMounted, watch, nextTick } from "vue";
import type { HeadTable } from "../types/headTable";
import type { BodyTable } from "../types/bodyTable";
import { useSelect } from "../composables/useSelect";
import { useNuxtApp,useRuntimeConfig } from "#app";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";
import { onBeforeUnmount } from "vue";
const config = useRuntimeConfig()

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
  active: [
    { value: 0, label: "Finalizado" },
    { value: 1, label: "Activo" },
  ],
};

const props = defineProps<{
  head: HeadTable[];
  content?: BodyTable[];
  model: string;
  title: string;
  isEditable?: boolean;
  add?: boolean;
  remove?: boolean;
  actions?: { title: string; modal: string; operation: string; enabled?: boolean }[];
  reload?: boolean;
  filters?: {
  year?: number;
  month?: number;
  local?: string;
};
  
}>();

console.log('props',props);

// Usa ref para almacenar los datos de la tabla
const tableContent = ref<BodyTable[]>(props.content && props.content.length > 0 ? [...props.content] : []);
const originalContent = ref<BodyTable[]>([]);
console.log('tableContent',tableContent);
console.log('originalContent',originalContent);

const auth = useAuth();
const token = auth.getToken();
const isLoading = ref(false);
const showChanges = ref(false);
const isEdit = ref(false);
const activeRow = ref<BodyTable | null>(null);

const select = useSelect();
const tableBody = ref(null);
const searchQuery = ref("");
const sortKey = ref<string | null>(null);
const sortOrder = ref<"asc" | "desc" | null>(null);
const isLargeScreen = ref(false); // Valor inicial seguro en SSR


// ** Modificado para que use `tableContent` **
const isEditedOrNew = computed(() => {
  return tableContent.value.some((row) => row.isEdited || row.isNew);
});

// ** Modificado para que use `tableContent` **
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

const fetchData = async () => {
  isLoading.value = true;

  // Construir la consulta incluyendo los filtros
  const query: Record<string, string | undefined> = {
    ...props.filters, // Usar filters directamente como parte del query
    search: searchQuery.value || undefined,
    sortKey: sortKey.value || undefined,
    sortOrder: sortOrder.value || undefined,
  };

  try {
    const response: any = await $fetch(props.model, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      baseURL: useRuntimeConfig().public.apiBase,
      query,
    });
    if (Array.isArray(response)) {
      tableContent.value = [...response];
      originalContent.value = JSON.parse(JSON.stringify(tableContent.value));
      console.log("✅ Datos actualizados desde el backend.");
    } else {
      console.warn("⚠️ Respuesta del backend no es un array:", response);
      tableContent.value = [];
    }
  } catch (error) {
    console.error("❌ Error al obtener datos:", error);
    $notyf.error("Error al obtener los datos.");
  } finally {
    isLoading.value = false;

    // Si la recarga fue forzada por `reload`, la reseteamos
    if (props.reload) {
      emit("update:reload", false);
      console.log("🔄 Reload completado, reseteando prop `reload`.");
    }
  }
};


// ** Modificado para usar `tableContent` **
const startEdit = () => {
  isEdit.value = true;
  showChanges.value = true;
  originalContent.value = JSON.parse(JSON.stringify(tableContent.value));
};

// ** Modificado para usar `tableContent` **
const cancel = () => {
  tableContent.value = [...originalContent.value];
  showChanges.value = false;
  isEdit.value = false;
};

// ** Modificado para usar `tableContent` **
const addRow = () => {
  const newRow = { isNew: true } as BodyTable;
  tableContent.value.unshift(newRow);
  nextTick(() => {
    if (tableBody.value) {
      tableBody.value.scrollTop = 0;
    }
  });
};

// ** Modificado para usar `tableContent` **
const toggleDelete = (row: BodyTable) => {
  if (row.isNew) {
    tableContent.value = tableContent.value.filter((r) => r !== row);
  } else {
    row.isDeleted = !row.isDeleted;
    row.isEdited = true;
  }
};

// ** Modificado para usar `tableContent` **
const apply = async () => {
  let updateRows = tableContent.value.filter((row) => row.isEdited || row.isNew || row.isDeleted);
  updateRows = updateRows.map((row) => {
    const { selected, ...cleanedRow } = row;
    return cleanedRow;
  });

  try {
    const response: any = await $fetch(props.model, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      baseURL: useRuntimeConfig().public.apiBase,
      body: updateRows,
    });

    if (response.status === "success") {
      isEdit.value = false;
      showChanges.value = false;
      await fetchData();
      tableContent.value.forEach((row) => {
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

// ** Modificado para usar `tableContent` **
onMounted(async () => {
  isLargeScreen.value = window.innerWidth >= 768;

  const updateSize = () => {
    isLargeScreen.value = window.innerWidth >= 768;
  };

  window.addEventListener("resize", updateSize);

  onBeforeUnmount(() => {
    window.removeEventListener("resize", updateSize);
  });

  await fetchData();
  for (const column of props.head) {
    if (column.isSelect && column.model)
      await select.fetchOptions(column.model, isLoading.value, token);
  }
});

const emit = defineEmits(["update:reload", "selected", "icon-click","affected-click"]);
const setActiveRow = (row: BodyTable) => {
  activeRow.value = row;
  emit("selected", row);
};

const markAsEdited = (row: BodyTable) => {
  if (!row.isEdited) {
    row.isEdited = true;
  }
};

const formatDate = (date) => {
  return date ? format(new Date(date), "yyyy-MM-dd") : "";
};

const updateDate = (row, key, event) => {
  row[key] = event.target.value ? parseISO(event.target.value) : null;
};

watch(() => props.reload, async (newValue) => {
  if (newValue) {
    console.log("🔄 Recargando datos porque `reload` cambió a true");
    await fetchData();
    emit("update:reload", false);
  }
});

watch(
  () => props.content,
  (newContent) => {
    if (newContent && Array.isArray(newContent)) {
      tableContent.value = [...newContent];
      originalContent.value = JSON.parse(JSON.stringify(newContent));
    }
  },
  { immediate: true }
);  

const handleIconClick = (row: BodyTable) => {
  emit("icon-click", row);
};

const handleAffectedClick = (row: BodyTable) => {
  emit("affected-click", row);
};
</script>

<template>
  <div class="flex h-full w-full flex-col">
    <!-- Contenedor adaptable para Título, Editar y Buscar -->
    <div class="flex flex-col gap-2 pb-2 lg:flex-row lg:items-center lg:justify-between">
      <div v-show="!showChanges || isLargeScreen" class="flex w-full items-center justify-between flex-col lg:flex-row">
        <h2 class="hidden lg:block text-lg font-semibold">{{ title }}</h2>
        <div class="flex gap-2">
          <!-- Renderizar acciones si se pasan -->
          <button v-for="action in actions" :key="action.modal" @click="$emit(`${action.operation}-${action.modal}`)"
            :class="[
              'text-sm lg:text-lg bg-blue-500 text-white px-4 py-2 rounded',
              (action.enabled ?? true) ? 'opacity-100 cursor-pointer' : 'opacity-50 cursor-not-allowed'

            ]">
            {{ action.title }}
          </button>

          <button v-show="isEditable" @click="startEdit" class="text-sm lg:text-lg rounded bg-primary px-4 py-2 text-white">
            Editar
          </button>
        </div>
      </div>

      <div v-show="showChanges" class="flex w-full justify-between space-x-2">
        <button @click="addRow" class="w-1/3 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700">
          +
        </button>
        <button @click="apply" :class="[
          'text-sm lg:text-lg w-1/3 rounded px-4 py-2 ',
          isEditedOrNew
            ? 'bg-green-500 text-white hover:bg-green-700'
            : 'cursor-not-allowed bg-gray-500 text-white',
        ]" :disabled="!isEditedOrNew">
          Aplicar
        </button>
        <button @click="cancel" class="text-sm lg:text-lg w-1/3 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700">
          Cancelar
        </button>
      </div>

      <div :class="{ 'w-full': !isLargeScreen }" class=" lg:w-auto">
        <input v-model="searchQuery" @input="fetchData" placeholder="Buscar..."
          class="search-input flex-grow rounded border bg-muted px-4 py-2 text-white" />
      </div>
    </div>

    <!-- Tabla con encabezado fijo y desplazamiento en el cuerpo -->
    <div class="table-container relative mx-auto h-full w-full">
      <table class="responsive-table h-full min-w-full table-auto divide-y divide-border border border-border">
        <thead class="sticky top-0 z-10 bg-muted dark:bg-muted">
          <tr>
            <th scope="col" class="w-8 min-w-0 p-1"></th>
            <th v-for="(col, index) in head" :key="index" scope="col"
              class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white"
              @click="sortByColumn(col.key)">
              <div class="flex items-center">
                {{ col.title }}
                <span class="ml-1" :class="{ active: sortKey == col.key && sortOrder == 'asc' }">▲</span>
                <span class="ml-1" :class="{ active: sortKey == col.key && sortOrder == 'desc' }">▼</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in tableContent" :key="rowIndex" :class="[
            'hover:bg-muted dark:hover:bg-muted',
            {
              'bg-accent dark:bg-accent': activeRow && activeRow.id === row.id,
              'bg-red-100 bg-opacity-50 dark:bg-red-700 dark:bg-opacity-50': row.isDeleted,
              'bg-green-100 bg-opacity-50 dark:bg-green-700 dark:bg-opacity-50': row.isNew,
            },
          ]" @click="setActiveRow(row)">
            <td class="p-4 justify-items-center">
              <button v-show="isEdit && remove" @click="toggleDelete(row)"
                class="hover:bg-destructive-dark flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-white">
                &minus;
              </button>
            </td>
            <td v-for="(column, colIndex) in head" :key="colIndex" class=" px-3 py-2 text-left justify-items-center">
              <!-- Verifica si el campo debe ser visible -->
              <div v-show="!column.isVisible || row[column.keyVisible] === column.isVisible" class="w-full">

                <div v-if="column.isConstant">
                  <Listbox v-model="row[column.key]" @update:modelValue="markAsEdited(row)">
                    <ListboxButton :class="[
                      column.key || '', // Siempre incluye el key como clase
                      'w-full rounded border  p-2 text-foreground', // Clases base
                      column.css && column.key ? `${column.key}-${row[column.key]}` : '' // Clases dinámicas opcionales
                    ]" :disabled="!isEdit || column.isEditable === false">
                      {{
                        CONSTANT_OPTIONS[column.key]?.find((option) => option.value == row[column.key])?.label ||
                        "Seleccionar"
                      }}
                    </ListboxButton>
                    <ListboxOptions v-show="isEdit"
                      class="absolute z-50 max-h-60 w-full overflow-auto rounded border border-border bg-background shadow-lg">
                      <ListboxOption v-for="option in CONSTANT_OPTIONS[column.key] || []" :key="option.value"
                        :value="option.value" class="cursor-pointer p-2 hover:bg-primary hover:text-white">
                        {{ option.label }}
                      </ListboxOption>
                    </ListboxOptions>
                  </Listbox>
                </div>
                <div v-else-if="column.isSelect">
                  <Listbox v-model="row[column.key]" @update:modelValue="markAsEdited(row)">
                    <ListboxButton :class="[
                      column.key || '', // Siempre incluye el key como clase
                      'w-full rounded border  p-2 text-foreground', // Clases base
                      column.css && column.key ? `${column.key}-${row[column.key]}` : '' // Clases dinámicas opcionales
                    ]" :disabled="!isEdit || column.isEditable == false">
                      {{
                        select.options[column.model]?.find((option) => option.id == row[column.key])?.[column.selectKey] ||
                        "Seleccionar"
                      }}
                    </ListboxButton>
                    <ListboxOptions v-show="isEdit"
                      class="absolute z-50 max-h-60 w-full overflow-auto rounded border border-border bg-background shadow-lg">
                      <ListboxOption v-for="option in select.options[column.model] || []" :key="option.id"
                        :value="option.id" class="cursor-pointer p-2 hover:bg-primary hover:text-white">
                        {{ option[column.selectKey] }}
                      </ListboxOption>
                    </ListboxOptions>
                  </Listbox>
                </div>
                <div v-else-if="column.type === 'date'">
                  <input type="date" :value="formatDate(row[column.key])" @input="updateDate(row, column.key, $event)"
                    :class="[
                      column.key || '',
                      'border-b-2 border-gray-300 bg-transparent dark:border-gray-700 w-full'
                    ]" :disabled="!isEdit || column.isEditable === false" />
                </div>
                <div v-else-if="column.type === 'icon'" class="justify-items-center">
                  <button @click.stop="handleIconClick(row)" class="text-xl text-red-500 hover:text-red-700">
                    <i :class="[column.icon]"></i>
                  </button>
                </div>
                <div v-else-if="column.type === 'custom' && column.key === 'affectedLocales'">
                  <button @click.stop="handleAffectedClick(row)"
                    class="cursor-pointer underline text-blue-600 hover:text-blue-800">
                    {{ column.customRender ? column.customRender(row) : row[column.key] }}
                  </button>
                </div>
                <div v-else>
                  <input :type="column.type || 'text'" v-model="row[column.key]" :class="[
                    column.key || '', // Siempre incluye el key como clase
                    'border-b-2 border-gray-300 bg-transparent dark:border-gray-700 w-full', // Clases base
                    column.css && column.key ? `${column.key}-${row[column.key]}` : '' // Clases dinámicas opcionales
                  ]" :disabled="!isEdit || column.isEditable === false" @input="markAsEdited(row)" />
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

tbody {
  overflow-y: unset;
  display: table;
  /* Asegura que se comporte como una tabla normal */
  width: 100%;
}

/* Ajustar las celdas en tbody */
tbody tr {
  display: table;
  width: 100%;

  height: 40px;
  /* Ajusta según sea necesario */

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

td:first-child,
th:first-child {
  width: 50px;
  /* Define un ancho pequeño */
  min-width: 50px;
  padding: 8px;
  /* Reduce el padding */
  text-align: center;
}


/* @media (min-width: 768px) {
  .search-input {
    width: auto;
  }
} */
@media (max-width: 768px) {
  .table-container {
    display: block;
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
    border: 1px solid var(--border);
    /* Asegura que la tabla se vea bien en mobile */
    /* padding-bottom: 10px; */
  }

  table {
    width: 100%;
    min-width: 600px;
    /* Evita que las columnas se colapsen demasiado */
    border-collapse: collapse;
    table-layout: auto;
    /* Permite que las columnas se ajusten mejor */
  }

  thead {
    display: table;
    width: 100%;
    table-layout: fixed;
    background-color: var(--muted);
  }

  tbody {
    display: block;
    overflow-x: auto;
    width: 100%;
  }

  th, td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 8px;
  font-size: 14px;
}

  /* Ajusta los botones de selección */
  .listbox-button {
    font-size: 14px;
    padding: 6px;
    text-align: left;
  }

  /* Ajusta los inputs en mobile */
  .input-field {
    font-size: 14px;
    padding: 4px;
    border-bottom: 1px solid var(--border);
  }

}
  .period-1 {
    background-color: hsl(var(--period-monthly));

  }

  .period-2 {
    background-color: hsl(var(--period-bimonthly));

  }

  .period-4 {
    background-color: hsl(var(--period-quarterly));

  }

  .period-8 {
    background-color: hsl(var(--period-semiannual));

  }

  .period-16 {
    background-color: hsl(var(--period-annual));
  }

  .status-1 {
    background-color: hsl(var(--green));
  }

  .status-2 {
    background-color: hsl(var(--red));
  }

  .active-true {
    background-color: hsl(var(--green));
  }

  .active-false {
    background-color: hsl(var(--red));
  }
</style>
