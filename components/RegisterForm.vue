<script setup lang="ts">
import { ref } from "vue";
import { useNuxtApp, navigateTo } from "#app";
import { useAuth } from "../composables/useAuth";

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const firstName = ref("");
const lastName = ref("");
const dni = ref(0);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const { register, error } = useAuth();
const { $notyf } = useNuxtApp();

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    $notyf.error("Las contraseñas no coinciden.");
    return;
  }

  await register(email.value, password.value, firstName.value,lastName.value, dni.value);

  if (error.value) {
    $notyf.error("Error al registrarse. Intenta nuevamente.");
  } else {
    // $notyf.success("Registro exitoso. ¡Por favor, inicia sesión!");
    navigateTo("/location");
  }
};
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary to-secondary px-4 py-12">
    <form @submit.prevent="handleRegister" class="form-container">
      <h2 class="mb-6 text-center text-2xl font-bold text-white">Crear una Cuenta</h2>

      <div class="mb-4">
        <label class="block text-white font-medium">Nombre</label>
        <input v-model="firstName" type="text" required class="input" />
      </div>

      <div class="mb-4">
        <label class="block text-white font-medium">Apellido</label>
        <input v-model="lastName" type="text" required class="input" />
      </div>
      <div class="mb-4">
        <label class="block text-white font-medium">Dni</label>
        <input v-model="dni" type="number" required class="input" />
      </div>

      <div class="mb-4">
        <label class="block text-white font-medium">Email</label>
        <input v-model="email" type="email" required class="input" />
      </div>

      <div class="mb-4">
        <label class="block text-white font-medium">Contraseña</label>
        <div class="relative">
          <input v-model="password" :type="showPassword ? 'text' : 'password'" required class="input" />
          <button type="button" @click="togglePasswordVisibility" class="absolute inset-y-0 right-0 px-2">
            <Icon :name="showPassword ? 'heroicons:eye-off' : 'heroicons:eye'" class="h-5 w-5 text-gray-300" />
          </button>
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-white font-medium">Confirmar Contraseña</label>
        <div class="relative">
          <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" required class="input" />
          <button type="button" @click="toggleConfirmPasswordVisibility" class="absolute inset-y-0 right-0 px-2">
            <Icon :name="showConfirmPassword ? 'heroicons:eye-off' : 'heroicons:eye'" class="h-5 w-5 text-gray-300" />
          </button>
        </div>
      </div>

      <button type="submit" class="btn-submit">
        Registrarse
      </button>

      <p class="mt-4 text-center text-sm text-gray-300">
        ¿Ya tienes una cuenta?
        <NuxtLink to="/login" class="text-white hover:underline">Inicia sesión aquí</NuxtLink>
      </p>
    </form>
  </div>
</template>

<style scoped>
/* Contenedor del formulario con fondo oscuro */
.form-container {
  max-width: 400px;
  width: 100%;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Inputs personalizados */
.input {
  @apply block w-full rounded-md border border-gray-500 bg-gray-800 px-3 py-2 text-white shadow-sm focus:border-primary focus:ring-primary;
}

/* Botón de enviar con gradiente */
.btn-submit {
  @apply w-full rounded-md bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-2 font-bold text-white shadow-lg transition hover:from-blue-600 hover:to-blue-700;
}
</style>
