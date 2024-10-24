<template>
  <div>
    <!-- Header -->
    <FullHeader />

    <!-- Sección Inicio -->
    <section
      id="inicio"
      class="flex min-h-screen items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
    >
      <div class="container mx-auto flex flex-col items-center justify-between lg:flex-row">
        <!-- Texto Principal -->
        <div class="space-y-5 text-center lg:w-1/2 lg:text-left">
          <h1 class="text-5xl font-bold">
            Gestiona tus Locales y Alquileres de manera Fácil y Eficiente
          </h1>
          <p class="text-xl">
            Administra contratos, incrementos de alquileres y locales de forma automatizada con
            nuestra plataforma.
          </p>
          <button
            class="rounded-md bg-white px-6 py-3 font-bold text-indigo-600 hover:bg-indigo-100"
            @click="scrollToSection('services')"
          >
            Empieza Ahora
          </button>
        </div>

        <!-- Imagen 3D a la Derecha -->
        <div class="mt-8 lg:mt-0 lg:w-1/2">
          <img
            src="../../assets/images/person-working-3d.png"
            alt="Persona trabajando"
            class="h-auto w-full object-cover"
          />
        </div>
      </div>
    </section>

    <!-- Sección Servicios -->
    <section id="services" class="flex min-h-screen flex-col justify-center bg-gray-100 py-20">
      <div class="container mx-auto">
        <h2 class="mb-12 text-center text-4xl font-bold">Servicios que Ofrecemos</h2>
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <!-- Card 1 -->
          <div
            class="h-70 flex flex-col items-center justify-center rounded-lg border border-gray-300 bg-white p-8 shadow-lg hover:border-gray-400"
          >
            <i class="fas fa-file-alt fa-3x mb-4 text-indigo-600"></i>
            <h3 class="mb-4 text-center text-xl font-bold">Gestión de Contratos</h3>
            <p class="text-center text-gray-600">
              Mantén tus contratos siempre organizados. Recibe notificaciones antes de que caduquen
              y renueva de forma automática.
            </p>
          </div>

          <!-- Card 2 -->
          <div
            class="h-70 flex flex-col items-center justify-center rounded-lg border border-gray-300 bg-white p-8 shadow-lg hover:border-gray-400"
          >
            <i class="fas fa-coins fa-3x mb-4 text-indigo-600"></i>
            <h3 class="mb-4 text-center text-xl font-bold">Aumentos Programados</h3>
            <p class="text-center text-gray-600">
              Configura aumentos automáticos por porcentaje o tiempo, y olvídate de los cálculos
              manuales.
            </p>
          </div>

          <!-- Card 3 -->
          <div
            class="h-70 flex flex-col items-center justify-center rounded-lg border border-gray-300 bg-white p-8 shadow-lg hover:border-gray-400"
          >
            <i class="fas fa-store-alt fa-3x mb-4 text-indigo-600"></i>
            <h3 class="mb-4 text-center text-xl font-bold">Control de Locales</h3>
            <p class="text-center text-gray-600">
              Administra varios locales desde un solo lugar, visualiza su estado y la información
              relevante en tiempo real.
            </p>
          </div>

          <!-- Card 4 -->
          <div
            class="h-70 flex flex-col items-center justify-center rounded-lg border border-gray-300 bg-white p-8 shadow-lg hover:border-gray-400"
          >
            <i class="fas fa-calendar-alt fa-3x mb-4 text-indigo-600"></i>
            <h3 class="mb-4 text-center text-xl font-bold">Programación de Pagos</h3>
            <p class="text-center text-gray-600">
              Automatiza los pagos de alquileres con recordatorios y configuraciones programadas.
            </p>
          </div>

          <!-- Card 5 -->
          <div
            class="h-70 flex flex-col items-center justify-center rounded-lg border border-gray-300 bg-white p-8 shadow-lg hover:border-gray-400"
          >
            <i class="fas fa-bell fa-3x mb-4 text-indigo-600"></i>
            <h3 class="mb-4 text-center text-xl font-bold">Notificaciones y Alertas</h3>
            <p class="text-center text-gray-600">
              Recibe alertas antes de que los contratos finalicen o cuando se realicen pagos
              pendientes.
            </p>
          </div>

          <!-- Card 6 -->
          <div
            class="h-70 flex flex-col items-center justify-center rounded-lg border border-gray-300 bg-white p-8 shadow-lg hover:border-gray-400"
          >
            <i class="fas fa-chart-bar fa-3x mb-4 text-indigo-600"></i>
            <h3 class="mb-4 text-center text-xl font-bold">Reportes Personalizados</h3>
            <p class="text-center text-gray-600">
              Genera reportes detallados sobre el estado de los contratos, pagos y rendimiento de
              los locales.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección Regístrate -->
    <section
      id="about"
      class="flex min-h-screen flex-col justify-center bg-gradient-to-r from-purple-500 to-indigo-500 py-20 text-white"
    >
      <div class="container mx-auto text-center">
        <h2 class="mb-12 text-4xl font-bold">Regístrate y comienza a mejorar tu gestión</h2>
        <div
          class="flex flex-col items-center justify-center space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0"
        >
          <div class="lg:w-1/2">
            <p class="text-lg">
              Nuestra aplicación está diseñada para optimizar la gestión de locales y alquileres,
              ofreciendo soluciones automatizadas que ahorran tiempo y mejoran la precisión. Con
              ella, puedes gestionar contratos, programar incrementos de alquileres, administrar
              múltiples locales y generar reportes detallados de manera sencilla.
            </p>
            <p class="mt-6 text-lg">
              Si eres propietario de varios inmuebles o un administrador de propiedades, nuestra
              plataforma te proporcionará todas las herramientas que necesitas para mantenerte
              organizado y maximizar la eficiencia en tus operaciones diarias.
            </p>
            <p class="mt-6 text-lg">
              Con nuestras funciones avanzadas de automatización y alertas, te asegurarás de que
              ningún contrato se quede sin renovar y ningún pago sin registrar.
            </p>
          </div>
          <div class="lg:w-1/2">
            <img
              src="../../assets/images/about-image.png"
              alt="Sobre Nosotros"
              class="h-auto w-full object-cover"
            />
          </div>
        </div>

        <!-- Botón "Registrarse Ahora" -->
        <div class="mt-16">
          <button
            class="rounded-md bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-500"
            @click="scrollToSection('login')"
          >
            Registrarse Ahora
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import FullHeader from "./header.vue";

  // Función para hacer scroll a las secciones
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
</script>

<style scoped>
  /* Aquí no se necesitan estilos adicionales, ya que Tailwind gestiona el espaciado y el diseño */
</style>
