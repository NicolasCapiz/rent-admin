export default defineNuxtConfig({
  devtools: { enabled: true },

  vue: {
    config: {
      devtools: true, // Esto habilita las herramientas de desarrollo de Vue
      productionTip: false,
    },
  },

  css: ["@/assets/css/tailwind.css"],

  modules: [
    "@nuxtjs/tailwindcss",
    "nuxt-icon",
    "@vueuse/nuxt",
    "nuxt-headlessui",
    "@morev/vue-transitions/nuxt",
    "@pinia/nuxt",
  ],

  plugins: [{ src: "~/plugins/notyf.js", ssr: false }],
  tailwindcss: { exposeConfig: true },
  headlessui: { prefix: "H" },

  app: {
    head: {
      title: "Analytics",
      link: [
        { rel: "icon", type: "image/x-icon", href: "/icon.svg" },
        // { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
        { rel: "stylesheet", href: "/_nuxt/assets/css/tailwind.css" },
        { rel: "preload", as: "style", href: "/_nuxt/assets/css/tailwind.css" },

        { rel: "preconnect", href: "https://rsms.me/" },
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
