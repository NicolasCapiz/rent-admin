<template>
  <header
    :class="{
      'fixed left-0 top-0 z-50 w-full bg-white shadow-md': true,
      '-translate-y-full transform': !isHeaderVisible,
      'transition-transform duration-500 ease-in-out': true,
    }"
  >
    <div class="container mx-auto flex items-center justify-between px-6 py-4">
      <!-- Logo -->
      <div class="flex items-center space-x-3">
        <span
          class="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-2xl font-bold text-transparent"
          >RentAdmin</span
        >
      </div>

      <!-- Navegación en Desktop -->
      <nav class="hidden space-x-6 font-semibold text-gray-700 lg:flex">
        <a href="#inicio" class="hover:text-indigo-600">Inicio</a>
        <a href="#services" class="hover:text-indigo-600">Servicios</a>
        <a href="#about" class="hover:text-indigo-600">Sobre Nosotros</a>
      </nav>

      <!-- Botones de Login y Registro -->
      <div class="flex space-x-4">
        <button
          @click="navigateToLogin"
          class="rounded-md border border-indigo-600 px-4 py-2 font-bold text-indigo-600 hover:bg-indigo-600 hover:text-white"
        >
          Login
        </button>
        <button
          @click="navigateToRegister"
          class="rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 font-bold text-white hover:from-indigo-600 hover:to-purple-600"
        >
          Registrarse
        </button>
      </div>

      <!-- Menú móvil -->
      <button @click="toggleMenu" class="flex items-center text-indigo-600 lg:hidden">
        <Icon name="heroicons:menu" class="h-8 w-8" />
      </button>
    </div>

    <!-- Menú móvil desplegable -->
    <transition name="slide-fade">
      <nav v-show="isMenuOpen" class="space-y-4 bg-white px-6 py-4 text-center shadow-md lg:hidden">
        <a
          href="#inicio"
          class="block font-semibold text-gray-700 hover:text-indigo-600"
          @click="closeMenu"
          >Inicio</a
        >
        <a
          href="#services"
          class="block font-semibold text-gray-700 hover:text-indigo-600"
          @click="closeMenu"
          >Servicios</a
        >
        <a
          href="#about"
          class="block font-semibold text-gray-700 hover:text-indigo-600"
          @click="closeMenu"
          >Sobre Nosotros</a
        >
        <button
          @click="navigateToLogin"
          class="block rounded-md border border-indigo-600 px-4 py-2 font-bold text-indigo-600 hover:bg-indigo-600 hover:text-white"
        >
          Login
        </button>
        <button
          @click="navigateToRegister"
          class="block rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 font-bold text-white hover:from-indigo-600 hover:to-purple-600"
        >
          Registrarse
        </button>
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

  // Función para hacer scroll a las secciones
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    closeMenu();
  };

  // Navegación a Login
  const navigateToLogin = () => {
    navigateTo("/login"); // Redirige a la ruta de login
  };

  // Navegación a Registrarse
  const navigateToRegister = () => {
    navigateTo("/register"); // Redirige a la ruta de registro
  };

  // Ocultar y mostrar el header en función del scroll
  const handleScroll = () => {
    const currentScrollPosition = window.pageYOffset;

    if (currentScrollPosition > lastScrollPosition) {
      isHeaderVisible.value = false; // Ocultar el header cuando se hace scroll hacia abajo
    } else {
      isHeaderVisible.value = true; // Mostrar el header cuando se hace scroll hacia arriba
    }
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
  /* Estilos para la transición del menú móvil */
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition:
      opacity 0.5s,
      transform 0.5s;
  }
  .slide-fade-enter-from,
  .slide-fade-leave-to {
    /* opacity: 0; */
    transform: translateY(-10px);
  }
</style>
