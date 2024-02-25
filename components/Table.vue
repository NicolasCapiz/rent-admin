<script setup lang="ts">
  import type { HeadTable } from "@/types/headTable";
  import type { BodyTable } from "@/types/bodyTable";
  import type { OptionsTable } from "@/types/optionsTable";
  import { useSelect } from "@/composables/useSelect";

  const props = defineProps<{
    head: HeadTable[];
    options: OptionsTable[];
    content: BodyTable[];
    model: string;
  }>();

  const setModified = (row: BodyTable) => {
    row.modified = true;
  };

  const getValue = (obj: any, keyPath: string) => {
    const keys = keyPath.split("."); // Divide la ruta de la clave en un array de claves
    let value = obj;
    // Itera sobre las claves y accede a la propiedad correspondiente en el objeto
    for (const key of keys) {
      value = value[key];
    }
    return value; // Retorna el valor final encontrado
  };

  // Variable para controlar la selección de todas las filas
  const selectAll = ref(false);
  const showDelete = ref(false);
  const isLoading = ref(false);
  let showChanges = ref(false);
  let isEdit = ref(false);
  const select = useSelect();
  const refresh = () => refreshNuxtData(props.model);

  const options = (option: any) => {
    console.log("option -->", option);

    // Mostrar u ocultar los checkboxes de eliminación en todas las filas
    props.content.forEach((row) => {
      row.isEdit = !row.isEdit;
    });
    if (option == "delete") {
      console.log("entre");

      showDelete.value = true;
    }
    if (option == "edit") {
      isEdit.value = true;
    }

    showChanges.value = true;
  };

  const cancel = () => {
    // Limpiar la selección de filas y ocultar los botones "Aplicar" y "Cancelar"
    props.content.forEach((row) => {
      row.delete = false;
    });
    showChanges.value = false;
    isEdit.value = false;
    showDelete.value = false;
  };

  const apply = async () => {
    // Obtener las filas seleccionadas
    console.log("--->", props.content);
    console.log("isEdit", isEdit.value);

    if (!isEdit.value) {
      console.log("entre acaaa");

      const selectedRowsIds = props.content.filter((row) => row.delete).map((row) => row.id);
      try {
        const response: any = await $fetch(props.model, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          baseURL: "http://localhost:3307",
          body: JSON.stringify(selectedRowsIds),
        });

        await refresh();
        if (response.status == "ok") {
          console.log("Filas eliminadas exitosamente");
        } else {
          console.error("Error al eliminar filas");
        }
      } catch (error) {
        console.error("Error de red:", error);
      }
    } else {
      let updateRows = props.content.filter((row) => row.modified);
      console.log("updateRows", updateRows);
      updateRows = updateRows.map((row) => {
        const { selected, modified, isEdit, delete: any, ...cleanedRow } = row;
        return cleanedRow; // Retornar el objeto row sin los campos especificados
      });

      try {
        const response: any = await $fetch(props.model, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          baseURL: "http://localhost:3307",
          body: JSON.stringify(updateRows),
        });

        if (response.ok) {
          console.log("Filas eliminadas exitosamente");
        } else {
          console.error("Error al eliminar filas");
        }
      } catch (error) {
        console.error("Error de red:", error);
      }
    }

    // Ocultar los botones "Aplicar" y "Cancelar"
    showChanges.value = false;
  };

  onMounted(async () => {
    for (const column of props.head) {
      if (column.isSelect && column.model) await select.fetchOptions(column.model, isLoading);
    }
  });

  // Asegúrate de que cada fila tenga una propiedad "showChanges" y "selected"
  props.content.forEach((row) => {
    row.delete = false;
    row.selected = false;
    row.modified = false;
  });
</script>
<template>
  <div class="w-100 overflow">
    <div class="align-items-center m-2 flex justify-between">
      <h2 class="p2 align-self-center">
        {{ model }}
      </h2>

      <div class="flex justify-end">
        <div v-for="(row, index) in props.options" :key="index">
          <button
            class="m-2 rounded bg-blue-500 px-4 py-2 text-white"
            v-if="!showChanges && row.key"
            @click="options(row.key)"
          >
            {{ row.label }}
          </button>
        </div>

        <button
          class="m-2 rounded bg-green-500 px-4 py-2 text-white"
          v-if="showChanges"
          @click="apply"
        >
          Aplicar
        </button>
        <button
          class="m-2 rounded bg-red-500 px-4 py-2 text-white"
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
          <!-- <th v-for="(row, index) in head" :key="index" scope="col" class="px-6 py-3">
          <button v-if="!showChanges && row.option" @click="options(row.key)">
            {{ row.title }}
          </button>
        </th>
        <th>
          <button v-if="showChanges" @click="apply">Aplicar</button>
          <button v-if="showChanges" @click="cancel">Cancelar</button>
        </th> -->
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in content"
          :key="index"
          class="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
        >
          <td class="w-4 p-4">
            <div class="flex items-center">
              <input
                v-model="row.delete"
                v-if="showDelete"
                id="checkbox-table-search-1"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
              />
            </div>
          </td>
          <td v-for="(value, index) in head" :key="index" class="px-6 py-4">
            <select
              v-if="!value.option && value.isSelect"
              v-model="row[value.key]"
              :disabled="!isEdit"
            >
              <option v-if="isLoading" disabled value="">Cargando...</option>
              <option
                else
                v-for="option of select.options[value.model]"
                :key="option.id"
                :value="option"
              >
                {{ option[value.selectKey] }}
              </option>
            </select>
            <input
              v-if="!value.option && !value.isSelect"
              :disabled="!isEdit"
              class="border-b border-gray-300 bg-transparent focus:outline-none"
              v-model="row[value.key]"
              @input="setModified(row)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
