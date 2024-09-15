<script setup lang="ts">
  import { useAuth } from "./composables/useAuth";
  import { computed } from "vue";

  // Obtén el estado de autenticación
  const { user } = useAuth();
  // const isAuthenticated = computed(() => !!user.value); // Verifica si el usuario está autenticado
  const isAuthenticated = true; // Verifica si el usuario está autenticado
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <!-- Header -->
    <Header />

    <div class="container flex-1 lg:grid lg:grid-cols-12 lg:gap-10">
      <!-- Sidebar -->
      <Sidebar
        v-show="isAuthenticated"
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
