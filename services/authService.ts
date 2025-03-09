import { useRuntimeConfig } from "nuxt/app";

const config = useRuntimeConfig();
const apiBaseURL = config.public.apiBase as string;
export const authService = {
  async login(email: string, password: string) {
    try {
      return await $fetch(`${apiBaseURL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { email, password },
      });
    } catch (error) {
      console.error("❌ Error al iniciar sesión:", error);
      throw new Error("Error al iniciar sesión. Verifica tus credenciales.");
    }
  },

  async register(email: string, password: string, name: string) {
    try {
      return await $fetch(`${apiBaseURL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { email, password, name },
      });
    } catch (error) {
      console.error("❌ Error en el registro:", error);
      throw new Error("Error en el registro. Verifica los datos ingresados.");
    }
  },

  async getUserDetails(token: string) {
    try {
      if (!token) throw new Error("Token no encontrado");

      return await $fetch(`${apiBaseURL}/auth/me`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("❌ Error al obtener usuario:", error);
      throw new Error("Error al obtener usuario. Inicia sesión nuevamente.");
    }
  },
};