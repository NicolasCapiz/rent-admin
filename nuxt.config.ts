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
      // apiBase: process.env.NUXT_PUBLIC_API_URL || "http://localhost:3307"
      // apiBase: process.env.NUXT_PUBLIC_API_URL || "http://localhost:3001"
      apiBase: "http://82.25.64.173:3001/api"
    },
  },
  css: ['@fortawesome/fontawesome-free/css/all.min.css',
    "@/assets/css/tailwind.css"], // 📌 Mantén solo aquí el CSS

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