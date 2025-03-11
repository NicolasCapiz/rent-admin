<script setup lang="ts">
import { computed, ref, onMounted, watch, watchEffect } from "vue";
import { useAuth } from "./composables/useAuth";
import { useRoute, useNuxtApp, navigateTo } from "#app";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useRuntimeConfig } from "nuxt/app";
import { useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const auth = useAuth();
const nuxtApp = useNuxtApp();

const isAuthenticated = ref(false);
const isClientChecked = ref(false);
const headerVisibility = ref(false);

// Obtener usuario y actualizar isAuthenticated observando auth.user
onMounted(() => {
  if (process.client) {
    auth.getUserDetails();
    watch(() => auth.user, (newUser) => {
      isAuthenticated.value = !!newUser;
      if (newUser) {
        isClientChecked.value = true;
      }
      console.log("auth.user updated:", newUser);
    }, { immediate: true });
  }
});

// Computed para obtener la ruta actual
const currentPath = computed(() => route.path);

// Actualizar headerVisibility basado en autenticación y ruta
watchEffect(() => {
  console.log("watchEffect route.path:", currentPath.value);
  headerVisibility.value = isAuthenticated.value && !["/home", "/login", "/register"].includes(currentPath.value);
});

// Si el usuario ya está autenticado y la ruta es "/login", redirigir a "/location"
router.afterEach((to, from) => {
  console.log("Route changed from:", from.fullPath, "to:", to.fullPath);
  headerVisibility.value = isAuthenticated.value && !["/home", "/login", "/register"].includes(to.path);
  // Si el usuario autenticado está en /login, redirige a /location
  if (isAuthenticated.value && to.path === "/login") {
    navigateTo("/location");
  }
});

// Computed para identificar rutas "neutras"
const valuePathNeutral = computed(() => {
  return ["/home", "/login", "/register"].includes(currentPath.value);
});

console.log(nuxtApp.$config);
</script>
<template>
  <div class="flex min-h-screen flex-col">
    <!-- Mostrar el Header solo si el usuario está autenticado y no está en /home -->
    <Header v-show=" headerVisibility" />

    <div   :key="route.path"
      :class="[ valuePathNeutral ? 'flex-1 lg:grid lg:grid-cols-12 lg:gap-5' : 'p-5 flex-1 lg:grid lg:grid-cols-12 lg:gap-5' ]">
    
      <!-- Mostrar el Sidebar solo si el usuario está autenticado y no está en /home -->
      <Sidebar
        v-show="  headerVisibility"
        class="sticky top-[65px] h-[calc(100vh-105px)] bg-card lg:col-span-2 xl:col-span-2"
      />

      <!-- Main Section -->
      <main
        :class="{
          'h-[calc(100vh-105px)] lg:col-span-10': headerVisibility,
          'h-100 lg:col-span-12':  !headerVisibility,
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
