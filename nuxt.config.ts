// https://nuxt.com/docs/api/configuration/nuxt-config
// import proxy from "@nuxtjs/proxy";

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "nuxt-icon",
    "@vueuse/nuxt",
    "nuxt-headlessui",
    "@morev/vue-transitions/nuxt",
    "@pinia/nuxt",
    // "@nuxt/http",
    // "@nuxtjs/proxy",
  ],
  tailwindcss: { exposeConfig: true },
  headlessui: { prefix: "H" },
  app: {
    head: {
      title: "Analytics",
      link: [
        // Favicon
        { rel: "icon", type: "image/x-icon", href: "/icon.svg" },
        //Inter font
        { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
        { rel: "preconnect", href: "https://rsms.me/" },
      ],
    },
  },
  // proxy: {
  //   "/api": "http://localhost:3000",
  // },
  // serverMiddleware: ["~/api/index.js"],
});
