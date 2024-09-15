<template>
  <div>
    <!-- Usar HDialog para crear el menú -->
    <HTransitionRoot appear :show="isOpen" as="div">
      <HDialog :open="isOpen" @close="isOpen = false" class="fixed inset-0 z-50 flex justify-start">
        <!-- Backdrop con animación -->
        <HTransitionChild
          as="div"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25 backdrop-blur" />
        </HTransitionChild>

        <!-- Menú móvil con animación de deslizamiento -->
        <HTransitionChild
          as="div"
          enter="duration-300 ease-out"
          enter-from="-translate-x-full opacity-0"
          leave="duration-200 ease-in"
          leave-to="-translate-x-full opacity-0"
        >
          <HDialogPanel class="relative h-full w-[80%] max-w-sm bg-background">
            <!-- Botón para cerrar el menú -->
            <button
              @click="isOpen = false"
              class="absolute right-4 top-4 rounded-full bg-red-500 p-2 text-white"
            >
              X
            </button>
            <!-- Sidebar del menú móvil -->
            <Sidebar />
          </HDialogPanel>
        </HTransitionChild>
      </HDialog>
    </HTransitionRoot>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import Sidebar from "./Sidebar.vue";

  // Renombra `defineModel` a algo diferente, por ejemplo `useIsOpenModel`
  const useIsOpenModel = {
    isOpen: {
      type: Boolean,
      default: false,
    },
  };

  // Estado para el menú móvil
  const isOpen = ref(false);
</script>
