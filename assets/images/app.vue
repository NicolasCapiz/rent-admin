<script setup lang="ts">
  import { useAuth } from "./composables/useAuth";
  import { computed } from "vue";
  import "@fortawesome/fontawesome-free/css/all.css";

  // Obtener el estado de autenticación
  const { user } = useAuth();
  const isAuthenticated = computed(() => !!user.value);
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <!-- Mostrar el Header solo si el usuario está autenticado -->
    <Header v-if="isAuthenticated" />

    <div class="flex-1 lg:grid lg:grid-cols-12 lg:gap-10">
      <!-- <div class="container flex-1 lg:grid lg:grid-cols-12 lg:gap-10"> -->
      <!-- Mostrar el Sidebar solo si el usuario está autenticado -->
      <Sidebar
        v-if="isAuthenticated"
        class="sticky top-[65px] h-[calc(100vh-65px)] py-5 lg:col-span-3 lg:block"
      />

      <!-- Main Section -->
      <main
        :class="{
          'h-[calc(100vh-105px)] lg:col-span-9': isAuthenticated,
          'h-100 lg:col-span-12': !isAuthenticated,
          'top-[65px] h-[calc(100vh-105px)]': true,
        }"
      >
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </main>
    </div>
  </div>
</template>
