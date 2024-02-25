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
  routeRules: {
    "/": {
      cors: true,
      // headers: {
      //   // CORS headers
      //   "Access-Control-Allow-Origin": "*", // 'http://example:6006', has to be set to the requesting domain that you want to send the credentials back to
      //   "Access-Control-Allow-Methods": "*", // 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
      //   "Access-Control-Allow-Credentials": "true",
      //   "Access-Control-Allow-Headers": "*", // 'Origin, Content-Type, Accept, Authorization, X-Requested-With'
      //   "Access-Control-Expose-Headers": "*",
      //   // 'Access-Control-Max-Age': '7200', // 7200 = caching 2 hours (Chromium default), https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age#directives
      // },
    },
  },
  // runtimeConfig: {
  //   API_URL: process.env.API_URL || "http://localhost:3307",
  // },
  // proxy: {
  //   "/api": "http://localhost:3000",
  // },
  // serverMiddleware: ["~/api/index.js"],
});
