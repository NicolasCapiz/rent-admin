import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { navigateTo, useCookie } from "#app";
import { useRuntimeConfig } from "nuxt/app";

export const useAuth = defineStore("auth", () => {
  // Función para obtener la base URL desde el runtime config
  const getApiBaseURL = () => {
    return useRuntimeConfig().public.apiBase;
  };

  const user = ref(null);
  const error = ref<string | null>(null);
  const isLoading = ref(false);
  let isFetchingUser = false; // Para evitar llamadas duplicadas

  // Usa cookie para guardar el token
  const token = process.client
    ? useCookie("auth_token", { maxAge: 60 * 60 * 24 * 7 })
    : ref(null);

  // Computed para saber si está autenticado
  const isAuthenticated = computed(() => !!user.value);

  // Obtiene el token desde la cookie
  const getToken = () => token?.value || null;

  // Verifica si el token ha expirado (JWT)
  const isTokenExpired = () => {
    const currentToken = getToken();
    if (!currentToken) return true;
    try {
      const payload = JSON.parse(atob(currentToken.split(".")[1])); // Decodifica JWT
      return payload.exp * 1000 < Date.now();
    } catch (err) {
      console.error("❌ Error decodificando el token:", err);
      return true;
    }
  };

  // Cierra sesión y elimina el token
  const logout = () => {
    if (process.client) {
      token.value = null;
    }
    user.value = null;
    navigateTo("/login");
  };

  // Obtiene los datos del usuario autenticado
  const getUserDetails = async () => {
    if (isFetchingUser || !process.client || !token.value) return;
    isFetchingUser = true;
    if (isTokenExpired()) {
      console.warn("⚠️ Token expirado, cerrando sesión.");
      logout();
      return;
    }
    try {
      console.log("🔄 Llamando a /auth/me...");
      const response = await $fetch(`${getApiBaseURL()}/auth/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      user.value = response;
      console.log("✅ Usuario autenticado:", user.value);
    } catch (err) {
      console.error("❌ Error al obtener usuario:", err);
      logout();
    } finally {
      isFetchingUser = false;
    }
  };

  // Inicia sesión y guarda el token en la cookie
  const login = async (email: string, password: string) => {
    try {
      console.log("🔄 Intentando login...");
      const response = await $fetch(`${getApiBaseURL()}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { email, password },
      });
      if (process.client) {
        token.value = response.access_token;
      }
      await getUserDetails();
      if (isAuthenticated.value) {
        console.log("✅ Usuario autenticado, redirigiendo...");
        return navigateTo("/location");
      }
    } catch (err) {
      console.error("❌ Error al iniciar sesión:", err);
      error.value = "Credenciales incorrectas.";
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      return await $fetch(`${getApiBaseURL()}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { email, password, name },
      });
    } catch (error) {
      console.error("❌ Error en el registro:", error);
      throw new Error("Error en el registro. Verifica los datos ingresados.");
    }
  };

  return { user, error, isAuthenticated, isLoading, getUserDetails, login, logout, getToken, register };
});
