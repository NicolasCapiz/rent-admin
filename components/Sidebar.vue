<template>
  <aside>
    <div
      class="flex h-full w-full flex-col gap-5 overflow-y-auto rounded-md border bg-card pb-5 scrollbar-thin scrollbar-thumb-input scrollbar-thumb-rounded-md"
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
        <Button
          title="Login"
          v-if="!isLogin"
          @click="toggleLogout"
        />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import type { Sidebar } from "@/types/sidebar";
  import Button from "@/components/buttons/Button.vue";

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
  const menu = ref<Sidebar[]>([
    {
      title: "Inicio",
      icons: "heroicons:home",
      link: "/home",
    },
    {
      title: "Inquilinos",
      icons: "heroicons:user-group",
      link: "/rents",
    },
    {
      title: "Locales",
      icons: "heroicons:building-storefront",
      link: "/property",
    },
    {
      title: "Pagos",
      icons: "heroicons:currency-dollar",
      link: "/payment",
    },
    {
      title: "Analytics",
      icons: "heroicons:chart-pie",
      link: "/analytics",
    },
  ]);
  const isLogin = ref<boolean>(true);
  const toggleLogout = () => {
    isLogin.value = !isLogin.value;
  };
</script>
