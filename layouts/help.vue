<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "@/composables/useAuth"; // Asegúrate de importar correctamente desde Pinia/Nuxt Store
import { useNuxtApp } from "#app";

const auth = useAuth();
const userEmail = auth.user?.email || "";
const userName = auth.user ? `${auth.user.firstName} ${auth.user.lastName}` : "";

const { $notyf } = useNuxtApp();

const form = ref({
  name: userName,
  email: userEmail,
  message: "",
});

const isSending = ref(false);

const sendHelpRequest = async () => {
  if (!form.value.message.trim()) {
    $notyf.error("Por favor, escribe un mensaje.");
    return;
  }

  isSending.value = true;
  try {
    await $fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        to: "nicolascapiz98@gmail.com",
        subject: `Solicitud de ayuda de ${form.value.name}`,
        text: `Nombre: ${form.value.name}\nEmail: ${form.value.email}\n\nMensaje:\n${form.value.message}`,
      },
    });

    $notyf.success("¡Mensaje enviado con éxito!");
    form.value.message = "";
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
    $notyf.error("No se pudo enviar el mensaje.");
  } finally {
    isSending.value = false;
  }
};
</script>

<template>
  <div class="help-container flex flex-col w-full h-full gap-6">
    <h1 class="text-3xl font-bold text-primary">Centro de Ayuda</h1>

    <!-- Tarjetas de información -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="card">
        <h2 class="text-lg font-semibold">📖 Guía de Uso</h2>
        <p>Aprende cómo administrar inquilinos, pagos y contratos.</p>
      </div>

      <div class="card">
        <h2 class="text-lg font-semibold">⚙️ Configuración</h2>
        <p>Personaliza los ajustes y usuarios de tu cuenta.</p>
      </div>

      <div class="card">
        <h2 class="text-lg font-semibold">📞 Soporte</h2>
        <p>Si tienes problemas, usa el formulario de abajo para contactarnos.</p>
      </div>
    </div>

    <!-- Formulario de contacto -->
    <div class="contact-form bg-card p-6 rounded-lg shadow-lg mt-6">
      <h2 class="text-xl font-semibold text-primary">📩 Enviar una solicitud de ayuda</h2>
      <p class="text-sm text-gray-400 mb-4">Te responderemos lo antes posible.</p>

      <form @submit.prevent="sendHelpRequest" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-muted-foreground">Nombre</label>
          <input type="text" v-model="form.name" disabled class="input bg-muted" />
        </div>

        <div>
          <label class="block text-sm font-medium text-muted-foreground">Email</label>
          <input type="email" v-model="form.email" disabled class="input bg-muted" />
        </div>

        <div>
          <label class="block text-sm font-medium text-muted-foreground">Mensaje</label>
          <textarea v-model="form.message" rows="4" class="input" placeholder="Escribe tu mensaje aquí..."></textarea>
        </div>

        <button type="submit" class="btn-primary w-full" :disabled="isSending">
          {{ isSending ? "Enviando..." : "Enviar Mensaje" }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.help-container {
  max-width: 900px;
  margin: auto;
}

/* Tarjetas informativas */
.card {
  background: hsl(var(--card));
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra en modo claro */
  transition: transform 0.2s ease-in-out;
}
.dark .card {
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1); /* Sombra más clara en modo oscuro */
  background: hsl(var(--modal)); /* Usa un color similar al modal */
}
.card:hover {
  transform: translateY(-3px);
}

/* Estilos del formulario */
.input {
  width: 100%;
  padding: 10px;
  border: 1px solid hsl(var(--border));
  border-radius: 6px;
  background: hsl(var(--input-bg));
}

.btn-primary {
  background: hsl(var(--primary));
  color: white;
  padding: 12px;
  border-radius: 6px;
  text-align: center;
  font-weight: bold;
  transition: background 0.2s;
}

.btn-primary:disabled {
  background: hsl(var(--gray));
  cursor: not-allowed;
}

.contact-form {
  background: hsl(var(--card));
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.15); /* Sombra en modo claro */
}

/* Ajustar la sombra en modo oscuro */
.dark .contact-form {
  box-shadow: 0 1px 6px rgba(255, 255, 255, 0.1); /* Sombra más visible en dark mode */
  background: hsl(var(--modal));
}
</style>
