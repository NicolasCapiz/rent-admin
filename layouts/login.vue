<!-- pages/login/index.vue -->
<script setup lang="ts">
  import { ref } from "vue";
  //   import { useAuth } from "../composables/useAuth"; // Asumiendo que tienes un composable para manejar la autenticación
  import LoginForm from "../components/LoginForm.vue";
  import RegisterForm from "../components/RegisterForm.vue";

  // Manejador del estado de la pestaña activa
  const activeTab = ref("login");

  const toggleTab = (tab: string) => {
    activeTab.value = tab;
  };
</script>

<template>
  <div class="flex items-center justify-center bg-gradient-to-b from-primary to-secondary">
    <div class="w-full max-w-md rounded-md border bg-background p-8 shadow-lg">
      <div class="mb-8 flex justify-center">
        <button
          :class="[
            'rounded-t-md px-4 py-2',
            activeTab === 'login' ? 'bg-secondary text-white' : 'bg-muted text-muted-foreground',
          ]"
          @click="toggleTab('login')"
        >
          Log In
        </button>
        <button
          :class="[
            'rounded-t-md px-4 py-2',
            activeTab === 'register' ? 'bg-secondary text-white' : 'bg-muted text-muted-foreground',
          ]"
          @click="toggleTab('register')"
        >
          Register
        </button>
      </div>

      <component :is="activeTab === 'login' ? LoginForm : RegisterForm" />
    </div>
  </div>
</template>
