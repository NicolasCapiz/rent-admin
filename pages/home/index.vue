<template>
  <div>
    <FullHeader />

    <!-- Sección Inicio -->
    <section id="inicio" class="hero-section">
      <div class="container mx-auto flex flex-col items-center justify-between lg:flex-row">
        <div class="hero-text">
          <h1 class="text-5xl font-bold">Gestiona tus Locales y Alquileres Fácilmente</h1>
          <p class="text-xl">
            Administra contratos, incrementos de alquileres y locales automáticamente con Rent-Management.
          </p>
          <button class="btn-primary" @click="scrollToSection('services')">Empieza Ahora</button>
        </div>
        <div class="hero-image">
          <img src="../../assets/images/person-working-3d.png" alt="Persona trabajando" />
        </div>
      </div>
    </section>

    <!-- Sección Servicios -->
    <section id="services" class="section-bg">
      <div class="container mx-auto">
        <h2 class="section-title">Servicios que Ofrecemos</h2>
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <ServiceCard icon="fa-solid fa-file-alt" title="Gestión de Contratos" description="Organiza contratos y recibe alertas antes del vencimiento." />
          <ServiceCard icon="fa-solid fa-coins" title="Aumentos Programados" description="Automatiza incrementos de alquiler, sin cálculos manuales." />
          <ServiceCard icon="fa-solid fa-store" title="Control de Locales" description="Información en tiempo real sobre todos tus inmuebles." />
          <ServiceCard icon="fa-solid fa-calendar-alt" title="Programación de Pagos" description="Recordatorios automáticos y programación de cobros." />
          <ServiceCard icon="fa-solid fa-bell" title="Notificaciones y Alertas" description="Alertas sobre contratos próximos a vencer." />
          <ServiceCard icon="fa-solid fa-chart-bar" title="Reportes Personalizados" description="Reportes detallados de contratos y pagos." />
        </div>
      </div>
    </section>

    <!-- Sección Regístrate -->
    <section id="about" class="cta-section min-h-screen">
      <div class="container mx-auto flex flex-col justify-center h-full text-center">
        <h2 class="section-title">Regístrate y mejora tu gestión</h2>
        <div class="cta-content">
          <p class="text-xl">
            Automatiza y optimiza la gestión de tus alquileres con Rent-Management. Ahorrarás tiempo y recursos, reduciendo errores administrativos.
          </p>
          <div class="mt-10 grid gap-6 lg:grid-cols-3">
            <div class="feature-item">
              <i class="fa-solid fa-clock text-4xl"></i>
              <h3 class="mt-4 font-semibold">Automatización Completa</h3>
              <p>Ahorra tiempo eliminando tareas repetitivas.</p>
            </div>
            <div class="feature-item">
              <i class="fa-solid fa-shield-alt text-4xl"></i>
              <h3 class="mt-4 font-semibold">Seguridad y Privacidad</h3>
              <p>Datos seguros y confidenciales en todo momento.</p>
            </div>
            <div class="feature-item">
              <i class="fa-solid fa-users text-4xl"></i>
              <h3 class="mt-4 font-semibold">Gestión Centralizada</h3>
              <p>Control total sobre múltiples propiedades fácilmente.</p>
            </div>
          </div>
          <button class="btn-primary mt-12" @click="scrollToSection('login')">Registrarse Ahora</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useNuxtApp } from "nuxt/app";
import FullHeader from "./header.vue";
import ServiceCard from "@/components/serviceCard.vue";

const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId);
  section?.scrollIntoView({ behavior: "smooth" });
};

</script>

<style scoped>
.hero-section {
  @apply flex min-h-screen items-center justify-center bg-gradient-to-r from-primary to-secondary text-white;
}
.hero-text {
  @apply space-y-5 text-center lg:w-1/2 lg:text-left;
}
.hero-image img {
  @apply h-auto w-full object-cover;
}

.section-bg {
  @apply flex min-h-screen flex-col justify-center bg-muted py-20;
}
.section-title {
  @apply mb-12 text-4xl font-bold text-center text-foreground;
}

.cta-section {
  @apply flex flex-col justify-center bg-gradient-to-r from-secondary to-primary text-white py-20;
}
.cta-content {
  @apply flex flex-col items-center space-y-6;
}

.feature-item {
  @apply flex flex-col items-center gap-2;
}

.btn-primary {
  @apply rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 font-bold text-white shadow-lg hover:opacity-90;
}
</style>
