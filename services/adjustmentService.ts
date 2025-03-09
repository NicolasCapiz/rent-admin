import { useAuth } from "../composables/useAuth";
import { useNuxtApp } from "#app";
import { useRuntimeConfig } from "nuxt/app";

const config = useRuntimeConfig();
const apiBaseURL = config.public.apiBase as string;

const auth = useAuth();
const token = auth.getToken();

export const adjustmentService = {
  async fetchAdjustments() {
    const { $notyf } = useNuxtApp(); // Acceso a $notyf para notificaciones

    try {
      if (!token) {
        throw new Error("Token no encontrado");
      }

      const response = await $fetch(`${apiBaseURL}/priceAdjustments`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      $notyf.success("Ajustes obtenidos con éxito");
      return response;
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Error al obtener ajustes.";
      $notyf.error(errorMessage);
      console.error("Error al obtener ajustes:", error);
      throw error;
    }
  },

  async createAdjustment(newAdjustment: any) {
    const { $notyf } = useNuxtApp(); // Acceso a $notyf para notificaciones

    try {
      if (!token) {
        throw new Error("Token no encontrado");
      }

      const response = await $fetch(`${apiBaseURL}/priceAdjustments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: newAdjustment,
      });

      $notyf.success("Ajuste creado con éxito");
      return response;
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Error al crear ajuste.";
      $notyf.error(errorMessage);
      console.error("Error al crear ajuste:", error);
      throw error;
    }
  },
};