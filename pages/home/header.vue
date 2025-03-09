<template>
  <header
    :class="[
      'fixed left-0 top-0 z-50 w-full border-b shadow-md transition-transform duration-500 ease-in-out',
      { '-translate-y-full': !isHeaderVisible }
    ]"
    :style="{ background: `hsl(var(--background))`, color: `hsl(var(--foreground))` }"
  >
    <div class="container mx-auto flex items-center justify-between px-6 py-4">
      <!-- Logo -->
      <div class="flex items-center space-x-3">
        <span
          class="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-2xl font-bold text-transparent"
        >
          RentManagement
        </span>
      </div>

      <!-- Navegación en Desktop -->
      <nav class="hidden space-x-6 font-semibold lg:flex">
        <a href="#inicio" class="nav-link">Inicio</a>
        <a href="#services" class="nav-link">Servicios</a>
        <a href="#about" class="nav-link">Sobre Nosotros</a>
      </nav>

      <!-- Botones de Login y Registro -->
      <div class="flex space-x-4">
        <button @click="navigateToLogin" class="btn-outline">Login</button>
        <button @click="navigateToRegister" class="!text-white btn-primary">Registrarse</button>
      </div>

      <!-- Menú móvil -->
      <button @click="toggleMenu" class="flex items-center text-primary lg:hidden">
        <Icon name="heroicons:menu" class="h-8 w-8" />
      </button>
    </div>

    <!-- Menú móvil desplegable -->
    <transition name="slide-fade">
      <nav
        v-show="isMenuOpen"
        class="absolute left-0 top-16 w-full space-y-4 bg-card px-6 py-4 text-center shadow-md lg:hidden"
      >
        <a href="#inicio" class="nav-link" @click="closeMenu">Inicio</a>
        <a href="#services" class="nav-link" @click="closeMenu">Servicios</a>
        <a href="#about" class="nav-link" @click="closeMenu">Sobre Nosotros</a>
        <button @click="navigateToLogin" class="btn-outline w-full">Login</button>
        <button @click="navigateToRegister" class="btn-primary w-full">Registrarse</button>
      </nav>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { navigateTo } from "#app";

const isMenuOpen = ref(false);
const isHeaderVisible = ref(true);
let lastScrollPosition = 0;

// Función para abrir/cerrar el menú móvil
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// Cerrar el menú después de seleccionar una sección
const closeMenu = () => {
  isMenuOpen.value = false;
};

// Navegación a Login
const navigateToLogin = () => {
  navigateTo("/login");
};

// Navegación a Registro
const navigateToRegister = () => {
  navigateTo("/register");
};

// Ocultar y mostrar el header en función del scroll
const handleScroll = () => {
  const currentScrollPosition = window.pageYOffset;
  isHeaderVisible.value = currentScrollPosition < lastScrollPosition;
  lastScrollPosition = currentScrollPosition;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
/* 🔹 Transición del header */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition:
    opacity 0.5s,
    transform 0.5s;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
}

/* 🔹 Estilos para los enlaces */
.nav-link {
  color: hsl(var(--foreground));
  transition: color 0.3s ease-in-out;
}
.nav-link:hover {
  color: hsl(var(--primary));
}

/* 🔹 Botones */
.btn-outline {
  border: 2px solid hsl(var(--primary));
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  color: hsl(var(--primary));
  transition: all 0.3s ease-in-out;
}
.btn-outline:hover {
  background: hsl(var(--primary));
  color: hsl(var(--background));
}

.btn-primary {
  background: linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  color: hsl(var(--background));
  transition: all 0.3s ease-in-out;
}
.btn-primary:hover {
  opacity: 0.9;
}
</style>
