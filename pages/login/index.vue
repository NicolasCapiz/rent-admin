<script setup lang="ts">
  import { ref } from "vue";
  import { useAuth } from "../../composables/useAuth";
  import { useNuxtApp, navigateTo } from "#app";

  definePageMeta({
    layout: false,
    middleware: "auth",
  });

  const email = ref("");
  const password = ref("");
  const showPassword = ref(false);

  // Usar el composable `useAuth`
  const { login, error } = useAuth();

  // Función para cambiar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
  };

  // Llamar a la función login cuando se envía el formulario
  const handleLogin = async () => {
    const { $notyf } = useNuxtApp();
    await login(email.value, password.value);
    console.log("aca entre?");

    if (error) {
      $notyf.error("Error al iniciar sesión. Por favor, verifica tus credenciales.");
    } else {
      $notyf.success("Inicio de sesión exitoso. ¡Bienvenido de nuevo!");
      navigateTo("/renter"); // Redirigir al home
    }
  };
</script>

<template>
  <div class="flex min-h-screen w-screen">
    <!-- Left Side Image/Illustration -->
    <div
      class="hidden w-1/2 items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-500 lg:flex"
    >
      <img
        src="../../assets/images/person-working-3d.png"
        alt="Login Illustration"
        class="max-w-xs"
      />
    </div>

    <!-- Right Side (Login Form) -->
    <div class="flex w-full flex-col items-center justify-center bg-white p-8 lg:w-1/2">
      <h1 class="mb-4 text-2xl font-bold text-purple-700">Hello! Good Morning</h1>
      <h2 class="mb-6 text-xl font-semibold">Login your account</h2>

      <form @submit.prevent="handleLogin" class="w-full max-w-sm">
        <!-- Username -->
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            id="email"
            type="email"
            required
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <!-- Password -->
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              required
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute inset-y-0 right-0 flex items-center px-2"
            >
              <Icon
                :name="showPassword ? 'heroicons:eye-off' : 'heroicons:eye'"
                class="h-5 w-5 text-gray-400"
              />
            </button>
          </div>
        </div>

        <!-- Forgot Password & Login Button -->
        <div class="mb-6 flex items-center justify-between">
          <a href="#" class="text-sm text-indigo-600 hover:underline">Forgot password?</a>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-white shadow-lg hover:bg-indigo-600"
        >
          Login
        </button>

        <!-- Create Account Link -->
        <p class="mt-4 text-center text-sm">
          Don't have an account?
          <NuxtLink to="/register" class="text-indigo-600 hover:underline">Create Account</NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
  @media (max-width: 1024px) {
    .bg-gradient-to-br {
      background: none;
    }
  }
</style>
