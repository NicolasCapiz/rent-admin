import { useAuth } from "../composables/useAuth";
import { navigateTo } from "#app";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!process.client) return; // ✅ Evita ejecución en SSR

  const auth = useAuth();
  const token = auth.getToken(); // Usa la función centralizada

  console.log("🔄 Middleware ejecutado. Token:", token);

  if (token) {
    try {
      console.log("🔄 Llamando a /auth/me...");
      await auth.getUserDetails();
    } catch (error) {
      console.log("❌ Error en autenticación:", error);
      auth.logout();
      return navigateTo("/login");
    }
  }

  console.log("📌 Estado de autenticación antes de redirigir:", auth.isAuthenticated);

  if (!auth.isAuthenticated && to.path !== "/login" && to.path !== "/register") {
    console.log("❌ No autenticado, redirigiendo al login.");
    return navigateTo("/login");
  }

  if (auth.isAuthenticated && (to.path === "/login" || to.path === "/register")) {
    console.log("✅ Usuario autenticado, redirigiendo a home.");
    return navigateTo("/");
  }
});