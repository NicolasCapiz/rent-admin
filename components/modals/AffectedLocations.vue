<template>
  <div class="modal-overlay fixed inset-0 flex items-center justify-center z-50">
    <div class="modal-content rounded-lg p-6 w-full max-w-md">
      <div class="modal-header flex justify-between items-center mb-4">
        <h3 class="modal-title">Locales Afectados</h3>
        <button @click="$emit('close')" class="modal-close">Cerrar</button>
      </div>
      <div class="modal-body">
        <ul v-if="locations.length > 0">
          <li v-for="loc in locations" :key="loc.id" class="location-item">
            <span class="location-name">{{ loc.name }}</span>
            <small class="location-address">{{ loc.address }}</small>
          </li>
        </ul>
        <div v-else>
          <p class="no-locations">Este ajuste aplica a <strong>todos los locales</strong>.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  locations: any[];
}>();
</script>

<style scoped>

/* .modal-content {
  background-color: hsl(var(--modal));
  color: hsl(var(--modal-foreground));
  border-radius: var(--radius);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
} */

.modal-header {
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.25;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1rem;
  color: hsl(var(--secondary-foreground));
  cursor: pointer;
  transition: color 0.2s ease-in-out;
}

.modal-close:hover {
  color: hsl(var(--primary-foreground));
}

.modal-body {
  display: grid;
  gap: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.location-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid hsl(var(--border));
}

.location-name {
  font-weight: 600;
  padding-right: 0.5rem;
  color: hsl(var(--modal-foreground));
}

.location-address {
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
}

.no-locations {
  color: hsl(var(--muted-foreground));
  font-size: 0.95rem;
}
</style>
