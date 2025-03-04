<script setup lang="ts">
  definePageMeta({
    layout: "default",
    middleware: "auth",
  });
</script>

<template>
  <div class="w-full p-4">
    <h1 class="text-2xl font-bold">Bienvenido a la aplicación</h1>
    <p>Este es el contenido de la página principal.</p>
  </div>
</template>
