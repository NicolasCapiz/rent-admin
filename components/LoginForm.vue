<script setup lang="ts">
  import { ref } from "vue";
  import { useAuth } from "../composables/useAuth";
  import { useNuxtApp, navigateTo } from "#app"; // Importar useNuxtApp para acceder a $notyf

  const email = ref("");
  const password = ref("");
  const showPassword = ref(false);

  // Usar el composable `useAuth`
  const { login, error } = useAuth(); // Asegúrate de que login se utiliza correctamente

  // Función para cambiar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
  };

  // Llamar a la función login cuando se envía el formulario
  const handleLogin = async () => {
    const { $notyf } = useNuxtApp(); // Acceder a $notyf desde useNuxtApp

    await login(email.value, password.value);
    if (error.value) {
      // Mostrar un mensaje de error usando $notyf
      $notyf.error("Error al iniciar sesión. Por favor, verifica tus credenciales.");
    } else {
      // Mostrar un mensaje de éxito usando $notyf
      $notyf.success("Inicio de sesión exitoso. ¡Bienvenido de nuevo!");
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
        class="mt-1 block w-full rounded-md border border-gray-300 bg-background px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
      />
    </div>

    <div class="mb-4">
      <label for="password" class="block text-sm font-medium">Password</label>
      <div class="relative">
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          id="password"
          required
          class="mt-1 block w-full rounded-md border border-gray-300 bg-background px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
        />
        <button
          type="button"
          @click="togglePasswordVisibility"
          class="absolute inset-y-0 right-0 flex items-center px-2"
        >
          <Icon
            :name="showPassword ? 'heroicons:eye-off' : 'heroicons:eye'"
            class="h-5 w-5 text-muted-foreground"
          />
        </button>
      </div>
    </div>

    <button
      type="submit"
      class="to-white-500 hover:to-grey-600 w-full rounded-md bg-gradient-to-b from-blue-500 px-4 py-2 text-white shadow-lg hover:from-blue-600"
    >
      Log In
    </button>
  </form>
</template>

<style>
  /* LoginForm.vue */
  .form-container {
    max-width: 400px;
    width: 100%;
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  .gradient-background {
    background: linear-gradient(180deg, var(--primary), var(--secondary));
  }
</style>
