<script setup lang="ts">
  import { useAuth } from "./composables/useAuth";
  import { computed, ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import "@fortawesome/fontawesome-free/css/all.css";

  // Obtener el estado de autenticación
  const { isAuthenticated } = useAuth();

  // Obtener la ruta actual
  const route = useRoute();

  // Ref para controlar si la autenticación ha sido chequeada en el cliente
  const isClientChecked = ref(false);

  // Ejecutar solo en el cliente
  onMounted(() => {
    isClientChecked.value = true; // Se asegura de que estamos en el cliente
  });

  // Computed para verificar si mostrar el Header y Sidebar
  const shouldShowHeaderAndSidebar = computed(() => {
    // Si no hemos chequeado el cliente aún, no mostrar el header
    if (!isClientChecked.value) return false;
    console.log("isAuthenticated.value", isAuthenticated.value);

    // Verificar si está autenticado y en rutas específicas
    return (
      isAuthenticated.value &&
      route.path !== "/home" &&
      route.path !== "/login" &&
      route.path !== "/register"
    );
  });
  const valuePathNeutral = computed(() => {
    return route.path == "/home" || route.path == "/login" || route.path == "/register";
  });
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <!-- Mostrar el Header solo si el usuario está autenticado y no está en /home -->
    <Header v-if="shouldShowHeaderAndSidebar" />

    <div
      :class="{
        'p-5': !valuePathNeutral,
      }"
      class="flex-1 p-4 lg:grid lg:grid-cols-12 lg:gap-5"
    >
      <!-- Mostrar el Sidebar solo si el usuario está autenticado y no está en /home -->
      <Sidebar
        v-if="shouldShowHeaderAndSidebar"
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
    color: hsl(var(--card-foreground));
    border-radius: var(--radius);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
</style>
