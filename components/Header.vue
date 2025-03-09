<template>
  <header class="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
    <div class="p-5 flex h-16 items-center justify-between">
      <!-- Logo and page title -->
      <div class="flex items-center gap-3">
        <!-- Botón para abrir el menú lateral (sidebar) en pantallas móviles -->
        <button
          v-show="!isLoginPage"
          @click="toggleSidebar"
          aria-label="Open menu"
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-background lg:hidden"
        >
          <span class="sr-only">Button used to open menu</span>
          <Icon name="heroicons:bars-2" />
        </button>
        <!-- Logo -->
        <img
          src="https://img.logoipsum.com/296.svg"
          alt="Analytics logo"
          class="h-7 w-7 object-contain"
        />
        <!-- Page title -->
        <NuxtLink class="hidden lg:block text-xl font-bold" to="/">Rent-Management</NuxtLink>
      </div>

      <div class="flex items-center gap-5">
        <button
          v-show="!isLoginPage"
          @click="toggleTheme"
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-background"
        >
          <Icon name="heroicons:sun" class="h-5 w-5" />
        </button>

        <!-- Profile Dropdown menu con iniciales -->
        <HMenu v-show="!isLoginPage" as="div" class="relative">
          <HMenuButton
            class="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border"
            :style="{ backgroundColor: logoBackgroundColor }"
          >
            <span class="text-white font-semibold text-sm">
              {{ userInitials }}
            </span>
          </HMenuButton>
          <TransitionScale :scale="0.8" origin="top right">
            <HMenuItems
              class="absolute right-0 z-10 mt-3 w-48 rounded-md border bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div class="border-b px-3 py-1.5 text-sm">
                <p class="font-semibold">{{ fullName }}</p>
                <a :href="'mailto:' + user?.email" class="leading-none text-muted-foreground">
                  {{ user?.email || "email@example.com" }}
                </a>
              </div>
              <div class="p-1">
                <HMenuItem v-slot="{ active }">
                  <button
                    @click="logout"
                    :class="[active && 'bg-muted']"
                    class="inline-flex w-full items-center rounded-md p-2 text-sm font-medium text-red-500"
                  >
                    Logout
                  </button>
                </HMenuItem>
              </div>
            </HMenuItems>
          </TransitionScale>
        </HMenu>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useState, useRoute, navigateTo } from "#app";
import { computed, onMounted } from "vue";
import { useAuth } from "@/composables/useAuth"; // Importa la store de autenticación

const route = useRoute();
const isLoginPage = route.path === "/login" || route.path === "/register";

// Estado global del sidebar para manejarlo en móvil
const isOpen = useState("isSidebarOpen", () => false);
const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
};

// Manejo de tema
const mode = useColorMode();
const toggleTheme = () => {
  mode.value = mode.value === "dark" ? "light" : "dark";
};

// Obtener usuario autenticado desde la store
const auth = useAuth();
onMounted(() => {
  auth.getUserDetails(); // Asegura que el usuario se cargue
});

// Computed para obtener las iniciales del usuario
const userInitials = computed(() => {
  if (!auth.user?.firstName || !auth.user?.lastName) return "U";
  return (
    auth.user.firstName.charAt(0).toUpperCase() +
    auth.user.lastName.charAt(0).toUpperCase()
  );
});

// Computed para el nombre completo del usuario
const fullName = computed(() => {
  return auth.user ? `${auth.user.firstName} ${auth.user.lastName}` : "Usuario";
});

// Color de fondo del avatar (puedes cambiarlo si quieres algo dinámico)
const logoBackgroundColor = "#2563eb"; // Azul similar al icono del título

// Función para cerrar sesión
const logout = () => {
  auth.logout();
};
</script>
