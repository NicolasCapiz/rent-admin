<template>
  <aside
    :class="{
      'hidden lg:block': !isOpen, // Ocultar el sidebar en pantallas pequeñas
      'block lg:block': isOpen, // Mostrar en pantallas pequeñas si el menú está abierto
    }"
    class="z-[1000]"
  >
    <div
      class="flex h-full w-full flex-col gap-5 overflow-y-auto rounded-md border bg-card scrollbar-thin scrollbar-thumb-input scrollbar-thumb-rounded-md"
    >
      <SidebarItem :links="menu" @click="closeSidebar" />

      <div class="mt-auto">
        <SidebarItem :links="bottomMenu" />
        
        <!-- Botón de Logout -->
        <Button
          icon="heroicons:arrow-left-on-rectangle"
          title="Cerrar Sesion"
          @click="handleLogout"
        />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useState, navigateTo } from "#app"; 
import { useAuth } from "@/composables/useAuth"; // Importa la store de autenticación
import type { Sidebar } from "@/types/sidebar";
import Button from "@/components/buttons/Button.vue";

const auth = useAuth(); // Instancia de la store de autenticación
const isOpen = useState("isSidebarOpen", () => false); // Controla si el sidebar está abierto

const menu = [
  { title: "Estadisticas", icons: "heroicons-outline:chart-bar", link: "/dashboards" },
  { title: "Inquilinos", icons: "heroicons:user-group", link: "/renter" },
  { title: "Locales", icons: "heroicons:building-storefront", link: "/location" },
  { title: "Pagos", icons: "heroicons:currency-dollar", link: "/payment" },
  { title: "Resumen de Pagos", icons: "heroicons:chart-pie", link: "/paymentRecord" },
  { title: "Aumentos", icons: "heroicons:adjustments-horizontal", link: "/adjustment" },
  { title: "Contratos", icons: "heroicons:document-text", link: "/leaseContract" },
];

const bottomMenu = [
  { title: "Configuraciones", icons: "heroicons:cog-8-tooth", link: "/settings" },
  { title: "Ayuda", icons: "heroicons:question-mark-circle", link: "/help" },
];

// Función para cerrar el sidebar en pantallas pequeñas
const closeSidebar = () => {
  if (window.innerWidth < 1024) {
    isOpen.value = false;
  }
};

// Función para cerrar sesión
const handleLogout = () => {
  auth.logout(); // Llama a la función de logout de la store
  closeSidebar(); // Cierra el sidebar si está abierto
};

// Cierra el sidebar al montar si es pantalla pequeña
onMounted(() => {
  if (window.innerWidth < 1024) {
    isOpen.value = false;
  }
});
</script>
