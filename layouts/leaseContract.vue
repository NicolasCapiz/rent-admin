<!-- layouts/leaseContract.vue -->
<template>
  <div class="lease-contract-layout">
    <!-- Puedes agregar aquí elementos comunes, como header o sidebar -->
    <header class="p-4 bg-gray-100">
      <h1 class="text-xl font-bold">Módulo de Contratos de Arrendamiento</h1>
    </header>

    <!-- Aquí se inyecta el contenido de la página -->
    <NuxtPage />

    <footer class="p-4 bg-gray-100 text-center">
      <p>© 2025 Mi Proyecto</p>
    </footer>
  </div>
</template>

<style scoped>
.lease-contract-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
