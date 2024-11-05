import { useAuth } from "../composables/useAuth";
import { navigateTo } from "#app";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, logout } = useAuth();
  const apiBaseURL = "http://localhost:3307"; // Cambia esto según tu configuración

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    console.log("tokenlele", token);

    if (token) {
      try {
        // Intentamos hacer una llamada para validar el token en el backend
        await $fetch(`${apiBaseURL}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.log("al final hay error", error);

        // Si obtenemos un error de autenticación, el token ha expirado
        if (error) {
          logout(); // Llamamos a logout para limpiar el token
          return navigateTo("/login"); // Redirigimos al login
        }
      }
    }
  }

  if (!isAuthenticated.value && to.path !== "/login" && to.path !== "/register") {
    return navigateTo("/login"); // Redirige al login si no está autenticado
  }

  if (isAuthenticated.value && (to.path === "/login" || to.path === "/register")) {
    return navigateTo("/"); // Redirige a la página principal o default
  }
});
