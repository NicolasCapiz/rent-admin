<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import { useAuth } from "./composables/useAuth";
import { useRoute, useNuxtApp } from "#app";
import "@fortawesome/fontawesome-free/css/all.min.css";

const route = useRoute();

const isAuthenticated = ref(false);
const isClientChecked = ref(false);

// Ejecutar en el cliente: obtener detalles del usuario y sincronizar el estado
onMounted(() => {
  if (process.client) {
    const auth = useAuth();
    auth.getUserDetails();

    // Sincronizar el estado autenticado usando un watcher
    watch(
      () => auth.isAuthenticated,
      (newVal) => {
        isAuthenticated.value = newVal;
      },
      { immediate: true }
    );

    isClientChecked.value = true;
  }
});

// Computed que determina si se deben mostrar el Header y el Sidebar
const shouldShowHeaderAndSidebar = computed(() => {
  if (!isClientChecked.value) return false;
  console.log("isAuthenticated.value", isAuthenticated.value);
  return (
    isAuthenticated.value &&
    route.path !== "/home" &&
    route.path !== "/login" &&
    route.path !== "/register"
  );
});

// Computed para identificar rutas "neutras"
const valuePathNeutral = computed(() => {
  return route.path === "/home" || route.path === "/login" || route.path === "/register";
});

const nuxtApp = useNuxtApp();
console.log(nuxtApp.$config);
</script>
<template>
  <div class="flex min-h-screen flex-col">
    <!-- Mostrar el Header solo si el usuario está autenticado y no está en /home -->
    <Header v-show="shouldShowHeaderAndSidebar" />

    <div   :key="route.path"
      :class="[ valuePathNeutral ? 'flex-1 lg:grid lg:grid-cols-12 lg:gap-5' : 'p-5 flex-1 lg:grid lg:grid-cols-12 lg:gap-5' ]">
    
      <!-- Mostrar el Sidebar solo si el usuario está autenticado y no está en /home -->
      <Sidebar
        v-show=" shouldShowHeaderAndSidebar"
        class="sticky top-[65px] h-[calc(100vh-105px)] bg-card lg:col-span-2 xl:col-span-2"
      />

      <!-- Main Section -->
      <main
        :class="{
          'h-[calc(100vh-105px)] lg:col-span-10': shouldShowHeaderAndSidebar,
          'h-100 lg:col-span-12': !shouldShowHeaderAndSidebar,
          'top-[65px] h-[calc(100vh-105px)]': true,
        }"
        class="flex flex-grow flex-col items-center bg-card text-card-foreground"
      >
        <NuxtLayout>
          
          <NuxtPage />
        </NuxtLayout>
      </main>
    </div>
  </div>
</template>

<style scoped>
  .app-container {
    background-color: hsl(var(--background));
  }

  .main-section {
    /* color: hsl(var(--card-foreground)); */
    border-radius: var(--radius);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
</style>
