<script setup lang="ts">
  import { ref } from "vue";
  import { useRouter } from "vue-router"; // Importar useRouter para la redirección
  import { useAuth } from "../composables/useAuth";
  import { useNuxtApp } from "#app"; // Importar useNuxtApp para acceder a $notyf

  const email = ref("");
  const password = ref("");
  const confirmPassword = ref("");
  const firstName = ref("");
  const lastName = ref("");
  const showPassword = ref(false);
  const showConfirmPassword = ref(false);
  const confirmPasswordError = ref(""); // Para manejar el error de confirmación de contraseña

  // Usar el composable `useAuth`
  const { register: authRegister, error } = useAuth(); // Usar `register` del composable `useAuth`

  // Router para la redirección
  const router = useRouter();

  // Función para cambiar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
  };

  const toggleConfirmPasswordVisibility = () => {
    showConfirmPassword.value = !showConfirmPassword.value;
  };

  // Función de registro
  const register = async () => {
    const { $notyf } = useNuxtApp(); // Acceder a $notyf desde useNuxtApp

    // Validar la confirmación de la contraseña
    if (password.value !== confirmPassword.value) {
      confirmPasswordError.value = "Las contraseñas no coinciden";
      $notyf.error(confirmPasswordError.value); // Mostrar notificación de error
      return;
    }

    // Realizar el registro llamando a la función `register` del composable `useAuth`
    await authRegister(email.value, password.value, firstName.value, lastName.value);

    // Manejar el error si existe
    if (error.value) {
      $notyf.error(error.value); // Mostrar el mensaje de error desde el backend
    } else {
      $notyf.success("Registro exitoso. ¡Por favor, inicia sesión!"); // Mostrar el mensaje de éxito
      router.push("/login"); // Redirigir al login después del registro exitoso
    }
  };
</script>

<template>
  <form @submit.prevent="register">
    <div class="mb-4">
      <label for="firstName" class="block text-sm font-medium">First Name</label>
      <input
        v-model="firstName"
        id="firstName"
        type="text"
        required
        class="mt-1 block w-full rounded-md border border-gray-300 bg-background px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
      />
    </div>

    <div class="mb-4">
      <label for="lastName" class="block text-sm font-medium">Last Name</label>
      <input
        v-model="lastName"
        id="lastName"
        type="text"
        required
        class="mt-1 block w-full rounded-md border border-gray-300 bg-background px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
      />
    </div>

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

    <div class="mb-4">
      <label for="confirmPassword" class="block text-sm font-medium">Confirm Password</label>
      <div class="relative">
        <input
          v-model="confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          id="confirmPassword"
          required
          class="mt-1 block w-full rounded-md border border-gray-300 bg-background px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
        />
        <button
          type="button"
          @click="toggleConfirmPasswordVisibility"
          class="absolute inset-y-0 right-0 flex items-center px-2"
        >
          <Icon
            :name="showConfirmPassword ? 'heroicons:eye-off' : 'heroicons:eye'"
            class="h-5 w-5 text-muted-foreground"
          />
        </button>
      </div>
    </div>

    <button
      type="submit"
      class="w-full rounded-md bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 text-white shadow-lg hover:from-orange-600 hover:to-red-600"
    >
      Register
    </button>
  </form>
</template>
