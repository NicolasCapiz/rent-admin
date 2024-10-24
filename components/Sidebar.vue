<template>
  <aside
    :class="{
      'hidden lg:block': !isOpen, // Ocultar el sidebar en pantallas pequeñas
      'block lg:block': isOpen, // Mostrar en pantallas pequeñas si el menú está abierto
    }"
    class="z-[1000]"
  >
    <div
      class="flex h-full w-full flex-col gap-5 overflow-y-auto rounded-md border bg-card scrollbar-thin scrollbar-thumb-input scrollbar-thumb-rounded-md"
    >
      <SidebarItem :links="menu" />

      <div class="mt-auto">
        <SidebarItem :links="bottomMenu" />
        <Button
          icon="heroicons:arrow-left-on-rectangle"
          title="Logout"
          v-if="isLogin"
          @click="toggleLogout"
        />
        <Button title="Login" v-if="!isLogin" @click="toggleLogout" />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { useState } from "#app"; // Usar el mismo estado global
  import type { Sidebar } from "@/types/sidebar";
  import Button from "@/components/buttons/Button.vue";

  const isOpen = useState("isSidebarOpen", () => false); // Usar el estado global para controlar apertura

  const menu = ref<Sidebar[]>([
    {
      title: "Inicio",
      icons: "heroicons:home",
      link: "/home",
    },
    {
      title: "Inquilinos",
      icons: "heroicons:user-group",
      link: "/renter",
    },
    {
      title: "Locales",
      icons: "heroicons:building-storefront",
      link: "/location",
    },
    {
      title: "Pagos",
      icons: "heroicons:currency-dollar",
      link: "/payment",
    },
  ]);

  const bottomMenu = ref<Sidebar[]>([
    {
      title: "Settings",
      icons: "heroicons:cog-8-tooth",
      link: "/settings",
    },
    {
      title: "Help",
      icons: "heroicons:question-mark-circle",
      link: "/help",
    },
  ]);

  const isLogin = ref(true);

  const toggleLogout = () => {
    isLogin.value = !isLogin.value;
  };
</script>
