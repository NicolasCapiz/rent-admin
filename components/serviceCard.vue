<template>
  <div class="card group">
    <div class="icon-circle">
      <i :class="icon"></i>
    </div>
    <h3 class="card-title">{{ title }}</h3>
    <p class="card-description">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  title: string;
  description: string;
}>();
</script>

<style scoped>
.card {
  @apply flex flex-col items-center justify-center rounded-lg p-6 shadow-md transition duration-300 ease-in-out border border-transparent;
  background-color: hsl(var(--card));
  color: hsl(var(--card-foreground));
}

.card:hover {
  transform: translateY(-0.5rem);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
}

.icon-circle {
  @apply flex items-center justify-center w-14 h-14 rounded-full bg-[hsl(var(--primary))] text-white mb-4;
}

.card-title {
  @apply text-xl font-bold mb-2 text-center;
}

.card-description {
  @apply text-center text-sm;
}
</style>