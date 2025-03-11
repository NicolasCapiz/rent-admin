<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "../../composables/useAuth";
import { useNuxtApp, navigateTo } from "#app";

// Eliminamos el middleware "auth" para la página de login, ya que debe ser pública.
definePageMeta({
  layout: false
});

const email = ref("");
const password = ref("");
const showPassword = ref(false);

const { login, error } = useAuth();

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  await login(email.value, password.value);
};
</script>

<template>
  <div class="login-container">
    <!-- Imagen a la izquierda -->
    <div class="login-image hidden lg:flex">
      <img src="../../assets/images/person-working-3d.png" alt="Login Illustration" class="max-w-md" />
    </div>

    <!-- Formulario de inicio de sesión -->
    <div class="flex w-full flex-col items-center justify-center p-10 lg:w-1/2">
      <div class="login-card">
        <h1 class="login-title">Bienvenido</h1>
        <p class="text-gray-500 dark:text-gray-400 mb-6">Inicia sesión en tu cuenta</p>

        <form @submit.prevent="handleLogin" class="space-y-4 w-full">
          <div>
            <label class="block text-sm font-medium">Email</label>
            <input v-model="email" type="email" required class="login-input" />
          </div>

          <div>
            <label class="block text-sm font-medium">Contraseña</label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="login-input"
              />
              <button @click="togglePasswordVisibility" type="button" class="absolute inset-y-0 right-2 flex items-center">
                <Icon :name="showPassword ? 'heroicons:eye-off' : 'heroicons:eye'" class="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          <button type="submit" class="btn-primary w-full">
            Iniciar Sesión
          </button>

          <!-- En lugar de la opción de recuperar contraseña, se muestra el enlace para registrarse -->
          <p class="text-sm text-gray-500 mt-4">
            ¿No tienes usuario? 
            <NuxtLink to="/register" class="text-primary hover:underline">
              Regístrate aquí
            </NuxtLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white shadow-sm focus:border-primary focus:ring-primary;
}

.btn-primary {
  @apply w-full rounded-md bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-2 font-bold text-white shadow-lg transition hover:from-blue-600 hover:to-blue-800;
}

/* Puedes agregar otros estilos según sea necesario */
</style>
