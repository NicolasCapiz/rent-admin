import { useAuth } from "../composables/useAuth"; // Importa correctamente tu composable de autenticación
import { navigateTo } from "#app"; // Importa la función navigateTo desde Nuxt

export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth(); // Usamos el composable de autenticación

  // Si el usuario no está autenticado y está tratando de acceder a una página protegida
  if (!isAuthenticated.value && to.path !== "/login" && to.path !== "/register") {
    return navigateTo("/login"); // Redirige al login si no está autenticado
  }

  // Si el usuario ya está autenticado y trata de acceder a /login o /register, lo redirigimos a la página principal
  if (isAuthenticated.value && (to.path === "/login" || to.path === "/register")) {
    return navigateTo("/"); // Redirige a la página principal o default
  }
});
