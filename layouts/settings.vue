<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "@/composables/useAuth";
import { useNuxtApp } from "#app";

const auth = useAuth();
const userEmail = auth.user?.email || "Sin email registrado";
const { $notyf } = useNuxtApp();

const notificationSettings = ref({
  priceIncrease: false,
  newEntityCreated: false,
  contractTerminated: false,
  billingSummary: "none",
  paymentReminders: false,
  contractExpiring: false,
  paymentReceived: false,
});

const saveSettings = () => {
  $notyf.success("Preferencias de notificación guardadas con éxito.");
};
</script>

<template>
  <div class="settings-container">
    <h1 class="title">Configuración de Notificaciones</h1>
    <p class="subtitle">Elige qué notificaciones quieres recibir por email.</p>

    <div class="card">
      <h2 class="section-title">📩 Preferencias de Email</h2>

      <div class="form-group">
        <span class="label">Tu email:</span>
        <span class="email">{{ userEmail }}</span>
      </div>

      <label class="form-group">
        <input type="checkbox" v-model="notificationSettings.priceIncrease" class="checkbox" />
        Notificarme cuando se realice un aumento de precio
      </label>

      <label class="form-group">
        <input type="checkbox" v-model="notificationSettings.newEntityCreated" class="checkbox" />
        Notificarme cuando se cree un nuevo contrato, inquilino o local
      </label>

      <label class="form-group">
        <input type="checkbox" v-model="notificationSettings.contractTerminated" class="checkbox" />
        Notificarme cuando finalice un contrato
      </label>

      <div class="form-group">
        <span class="label">Resumen de facturación:</span>
        <div class="radio-group">
          <label>
            <input type="radio" v-model="notificationSettings.billingSummary" value="daily" class="radio" />
            Diario
          </label>
          <label>
            <input type="radio" v-model="notificationSettings.billingSummary" value="weekly" class="radio" />
            Semanal
          </label>
          <label>
            <input type="radio" v-model="notificationSettings.billingSummary" value="monthly" class="radio" />
            Mensual
          </label>
          <label>
            <input type="radio" v-model="notificationSettings.billingSummary" value="none" class="radio" />
            No recibir
          </label>
        </div>
      </div>

      <label class="form-group">
        <input type="checkbox" v-model="notificationSettings.paymentReminders" class="checkbox" />
        Recibir recordatorios de pagos pendientes
      </label>

      <label class="form-group">
        <input type="checkbox" v-model="notificationSettings.contractExpiring" class="checkbox" />
        Recibir alerta cuando un contrato esté próximo a vencer
      </label>

      <label class="form-group">
        <input type="checkbox" v-model="notificationSettings.paymentReceived" class="checkbox" />
        Recibir notificación cuando se registre un pago
      </label>

      <button @click="saveSettings" class="btn-primary">Guardar Preferencias</button>
    </div>
  </div>
</template>

<style scoped>
/* Contenedor principal */
.settings-container {
  max-width: 700px;
  width: 100%;
  margin: auto;
  padding: 16px;
}

/* Títulos */
.title {
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 8px;
  color: hsl(var(--primary));
}

.subtitle {
  text-align: center;
  font-size: 1rem;
  color: hsl(var(--muted-foreground));
  margin-bottom: 16px;
}

/* Tarjeta de configuración */
.card {
  background: hsl(var(--card));
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: 0.3s;
}

/* Ajuste de sombras para modo oscuro */
.dark .card {
  background: hsl(var(--modal));
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.08);
}

/* Sección de email */
.form-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.label {
  font-weight: bold;
  color: hsl(var(--foreground));
}

.email {
  color: hsl(var(--muted-foreground));
}

/* Estilos de los inputs */
.checkbox,
.radio {
  width: 16px;
  height: 16px;
  accent-color: hsl(var(--primary));
}

/* Grupo de opciones de radio */
.radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

/* Botón de guardar */
.btn-primary {
  background: hsl(var(--primary));
  color: white;
  padding: 12px;
  width: 100%;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  margin-top: 16px;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: hsl(var(--primary) / 0.9);
}

/* Responsividad */
@media (max-width: 600px) {
  .settings-container {
    padding: 12px;
  }

  .card {
    padding: 16px;
  }

  .radio-group {
    flex-direction: column;
    gap: 6px;
  }
}
</style>
