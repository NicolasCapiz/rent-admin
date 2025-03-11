<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuth } from "@/composables/useAuth";
import { useNuxtApp } from "#app";
import { userService } from "@/services/userService";

const auth = useAuth();
const userEmail = auth.user?.email || "Sin email registrado";
const { $notyf } = useNuxtApp();

const notificationSettings = ref({
  notifyPriceIncrease: false,
  notifyContractEnded: false,
  notifyBillingSummary: "none",
  notifyPaymentReminder: false,
  notifyContractExpiring: false,
});

const loadSettings = async () => {
  try {
    notificationSettings.value = await userService.getNotificationSettings();
  } catch (error) {
    console.error("❌ Error al cargar preferencias:", error);
  }
};

const saveSettings = async () => {
  try {
    await userService.updateNotificationSettings(notificationSettings.value);
    $notyf.success("Preferencias guardadas con éxito.");
  } catch (error) {
    console.error("❌ Error al guardar preferencias:", error);
    $notyf.error("Error al guardar preferencias.");
  }
};

onMounted(loadSettings);
</script>

<template>
  <div class="settings-container">
    <h1 class="title">Configuración de Notificaciones</h1>
    <p class="subtitle">Elige qué notificaciones deseas recibir por email.</p>

    <div class="card">
      <h2 class="section-title">📩 Preferencias de Email</h2>

      <div class="form-group">
        <span class="label">Tu email:</span>
        <span class="email">{{ userEmail }}</span>
      </div>

      <div class="form-group">
        <span class="label">Notificarme cuando se realice un aumento de precio</span>
        <input type="checkbox" v-model="notificationSettings.notifyPriceIncrease" class="checkbox" />
      </div>

      <div class="form-group">
        <span class="label">Notificarme cuando finalice un contrato</span>
        <input type="checkbox" v-model="notificationSettings.notifyContractEnded" class="checkbox" />
      </div>

      <div class="form-group">
        <span class="label">Resumen de facturación:</span>
        <div class="radio-group">
          <label><input type="radio" v-model="notificationSettings.notifyBillingSummary" value="daily" class="radio" /> Diario</label>
          <label><input type="radio" v-model="notificationSettings.notifyBillingSummary" value="weekly" class="radio" /> Semanal</label>
          <label><input type="radio" v-model="notificationSettings.notifyBillingSummary" value="monthly" class="radio" /> Mensual</label>
          <label><input type="radio" v-model="notificationSettings.notifyBillingSummary" value="none" class="radio" /> No recibir</label>
        </div>
      </div>

      <div class="form-group">
        <span class="label">Recibir recordatorios de pagos pendientes</span>
        <input type="checkbox" v-model="notificationSettings.notifyPaymentReminder" class="checkbox" />
      </div>

      <div class="form-group">
        <span class="label">Recibir alerta cuando un contrato esté próximo a vencer</span>
        <input type="checkbox" v-model="notificationSettings.notifyContractExpiring" class="checkbox" />
      </div>

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
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 10px;
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
