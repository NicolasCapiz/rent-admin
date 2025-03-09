<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "../../composables/useAuth";
import { useNuxtApp, navigateTo } from "#app";

definePageMeta({
  layout: false,
  middleware: "auth",
});

const name = ref("");
const email = ref("");
const password = ref("");
const passwordConfirm = ref("");
const showPassword = ref(false);
const showPasswordConfirm = ref(false);

const { register, error } = useAuth();

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const togglePasswordConfirmVisibility = () => {
  showPasswordConfirm.value = !showPasswordConfirm.value;
};

const handleRegister = async () => {
  const { $notyf } = useNuxtApp();

  if (password.value !== passwordConfirm.value) {
    $notyf.error("Las contraseñas no coinciden.");
    return;
  }

  await register(email.value, password.value, name.value);

  if (error.value) {
    $notyf.error("Error al registrarse. Por favor, verifica los datos.");
  } else {
    $notyf.success("Registro exitoso. ¡Bienvenido!");
    navigateTo("/home");
  }
};
</script>

<template>
  <div class="flex min-h-screen w-screen">
    <!-- Lado Izquierdo: Imagen -->
    <div class="hidden w-1/2 items-center justify-center bg-gradient-to-br from-primary to-secondary lg:flex">
      <img src="../../assets/images/person-working-3d.png" alt="Registro" class="max-w-xs" />
    </div>

    <!-- Lado Derecho: Formulario de Registro -->
    <div class="flex w-full flex-col items-center justify-center bg-card p-8 lg:w-1/2 shadow-lg rounded-lg">
      <h1 class="mb-4 text-2xl font-bold text-blue-600">Crear una Cuenta</h1>
      <h2 class="mb-6 text-xl font-semibold text-gray-300">Regístrate</h2>

      <form @submit.prevent="handleRegister" class="w-full max-w-sm">
        <!-- Nombre -->
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-300">Nombre</label>
          <input
            v-model="name"
            id="name"
            type="text"
            required
            class="input"
          />
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-300">Correo Electrónico</label>
          <input
            v-model="email"
            id="email"
            type="email"
            required
            class="input"
          />
        </div>

        <!-- Contraseña -->
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-300">Contraseña</label>
          <div class="relative">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" id="password" required class="input" />
            <button type="button" @click="togglePasswordVisibility" class="absolute inset-y-0 right-0 px-2">
              <Icon :name="showPassword ? 'heroicons:eye-off' : 'heroicons:eye'" class="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        <!-- Confirmar Contraseña -->
        <div class="mb-4">
          <label for="passwordConfirm" class="block text-sm font-medium text-gray-300">Confirmar Contraseña</label>
          <div class="relative">
            <input v-model="passwordConfirm" :type="showPasswordConfirm ? 'text' : 'password'" id="passwordConfirm" required class="input" />
            <button type="button" @click="togglePasswordConfirmVisibility" class="absolute inset-y-0 right-0 px-2">
              <Icon :name="showPasswordConfirm ? 'heroicons:eye-off' : 'heroicons:eye'" class="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        <!-- Botón de Registro -->
        <button type="submit" class="btn-submit">
          Registrarse
        </button>

        <!-- Ya tienes cuenta -->
        <p class="mt-4 text-center text-sm text-gray-300">
          ¿Ya tienes una cuenta?
          <NuxtLink to="/login" class="text-blue-600 hover:underline">Inicia sesión aquí</NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Estilos para inputs */
.input {
  @apply block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white shadow-sm focus:border-primary focus:ring-primary;
}

/* Botón de enviar con gradiente AZUL */
.btn-submit {
  @apply w-full rounded-md bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-2 font-bold text-white shadow-lg transition hover:from-blue-600 hover:to-blue-800;
}

/* Ajuste para móviles */
@media (max-width: 1024px) {
  .bg-gradient-to-br {
    background: none;
  }
}
</style>
