<script setup lang="ts">
  import { ref } from "vue";
  import { useAuth } from "../../composables/useAuth";
  import { useNuxtApp } from "#app";
  import { useRouter } from "vue-router";
  definePageMeta({
    layout: false,
    middleware: "auth",
  });
  const name = ref("");
  const email = ref("");
  const password = ref("");
  const passwordConfirm = ref("");
  const captchaChecked = ref(false);
  const showPassword = ref(false);
  const showPasswordConfirm = ref(false);

  const { register, error } = useAuth();
  const router = useRouter();

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
      router.push("/home");
    }
  };
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Left Side Image/Illustration -->
    <div
      class="hidden w-1/2 items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-500 lg:flex"
    >
      <img
        src="../../assets/images/person-working-3d.png"
        alt="Register Illustration"
        class="max-w-xs"
      />
    </div>

    <!-- Right Side (Register Form) -->
    <div class="flex w-full flex-col items-center justify-center bg-white p-8 lg:w-1/2">
      <h1 class="mb-4 text-2xl font-bold text-purple-700">Create an Account</h1>
      <h2 class="mb-6 text-xl font-semibold">Sign up</h2>

      <form @submit.prevent="handleRegister" class="w-full max-w-sm">
        <!-- Name -->
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <input
            v-model="name"
            id="name"
            type="text"
            required
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <!-- Email -->
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

        <!-- Confirm Password -->
        <div class="mb-4">
          <label for="passwordConfirm" class="block text-sm font-medium text-gray-700"
            >Confirm Password</label
          >
          <div class="relative">
            <input
              v-model="passwordConfirm"
              :type="showPasswordConfirm ? 'text' : 'password'"
              id="passwordConfirm"
              required
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button
              type="button"
              @click="togglePasswordConfirmVisibility"
              class="absolute inset-y-0 right-0 flex items-center px-2"
            >
              <Icon
                :name="showPasswordConfirm ? 'heroicons:eye-off' : 'heroicons:eye'"
                class="h-5 w-5 text-gray-400"
              />
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-white shadow-lg hover:bg-indigo-600"
        >
          Sign Up
        </button>

        <!-- Already have an account -->
        <p class="mt-4 text-center text-sm">
          Already have an account?
          <NuxtLink to="/login" class="text-indigo-600 hover:underline">Login</NuxtLink>
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
