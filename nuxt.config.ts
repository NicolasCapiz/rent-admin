export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false, // Desactiva el SSR para evitar parpadeos en la carga
  pages: true,
  build: {
    extractCSS: true, // Extrae el CSS en archivos en lugar de inline
    transpile: ["@headlessui/vue"], // Transpila Headless UI si lo usas
  },
  runtimeConfig: {
    public: {
      apiBase: "http://localhost:3307/", // URL base del backend
    },
  },
  css: ["@/assets/css/tailwind.css"], // 📌 Mantén solo aquí el CSS

  modules: [
    "@nuxtjs/tailwindcss",
    "nuxt-icon",
    "@vueuse/nuxt",
    "nuxt-headlessui",
    "@morev/vue-transitions/nuxt",
    "@pinia/nuxt",
  ],

  plugins: [{ src: "~/plugins/notyf.js", ssr: false }], // 📌 Elimina `tailwindcss` de plugins

  tailwindcss: { exposeConfig: true },
  headlessui: { prefix: "H" },

  app: {
    head: {
      title: "rent-management",
      link: [
        { rel: "icon", type: "image/x-icon", href: "/icon.svg" },
      ],
    },
  },

  routeRules: {
    "/**": {
      cors: true,
    },
  },

  compatibilityDate: "2024-10-23",
});