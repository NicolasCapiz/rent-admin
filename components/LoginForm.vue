<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "../composables/useAuth";
import { useNuxtApp, navigateTo } from "#app";

// No es necesario usar middleware "auth" para la página de login
definePageMeta({
  layout: false,
});

const email = ref("");
const password = ref("");
const showPassword = ref(false);

// Usar el composable useAuth. Se asume que "login" retorna un objeto con "message" y "access_token" si es exitoso.
const { login, error } = useAuth();

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  
  const { $notyf } = useNuxtApp();
  console.log('aca empezo ju');
  const result = await login(email.value, password.value);
  console.log("Resultado de login:", result);
  if (!result || !result.success) {
    $notyf.error(result ? result.message : "Error al iniciar sesión. Verifica tus credenciales.");
  } else {
    $notyf.success(result.message);
    navigateTo("/renter");
  }
};

</script>

<template>
  <form @submit.prevent="handleLogin" class="form-container">
    <div class="mb-4">
      <label for="email" class="block text-sm font-medium">Email</label>
      <input
        v-model="email"
        id="email"
        type="email"
        required
        class="login-input"
      />
    </div>

    <div class="mb-4">
      <label for="password" class="block text-sm font-medium">Contraseña</label>
      <div class="relative">
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          id="password"
          required
          class="login-input"
        />
        <button
          @click="togglePasswordVisibility"
          type="button"
          class="absolute inset-y-0 right-2 flex items-center px-2"
        >
          <Icon
            :name="showPassword ? 'heroicons:eye-off' : 'heroicons:eye'"
            class="h-5 w-5 text-gray-500"
          />
        </button>
      </div>
    </div>

    <button type="submit" class="btn-primary w-full">
      Iniciar Sesión
    </button>

    <p class="text-sm text-gray-500 mt-4">
      ¿No tienes usuario?
      <NuxtLink to="/register" class="text-primary hover:underline">
        Regístrate aquí
      </NuxtLink>
    </p>
  </form>
</template>

<style scoped>
/* Estilos para el formulario de login */
.form-container {
  max-width: 400px;
  width: 100%;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.login-input {
  @apply block w-full rounded-md border border-gray-300 bg-background px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary;
}

.btn-primary {
  @apply w-full rounded-md bg-gradient-to-b from-blue-500 to-blue-700 px-4 py-2 font-bold text-white shadow-lg hover:from-blue-600;
}
</style>
