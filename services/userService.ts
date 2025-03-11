import api from "@/utils/api";
import { useAuth } from "@/composables/useAuth";
import { useRuntimeConfig } from "nuxt/app";

const config = useRuntimeConfig();
const apiBaseURL = config.public.apiBase as string;

export const userService = {

  // 🔹 Obtener preferencias de notificación del usuario
  async getNotificationSettings() {
    const auth = useAuth();
    const token = auth.getToken();

    if (!token) {
      console.error("❌ No hay token disponible. El usuario no está autenticado.");
      throw new Error("Usuario no autenticado.");
    }

    try {
      return await $fetch(`/users/notifications`, {
        method: "GET",
        baseURL: apiBaseURL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("❌ Error al obtener las preferencias de notificación:", error);
      throw error;
    }
  },

  // 🔹 Actualizar preferencias de notificación
  async updateNotificationSettings(settings: any) {
    const auth = useAuth();
    const token = auth.getToken();

    if (!token) {
      console.error("❌ No hay token disponible. El usuario no está autenticado.");
      throw new Error("Usuario no autenticado.");
    }

    try {
      return await $fetch(`/users/notifications`, {
        method: "PUT",
        baseURL: apiBaseURL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: settings,
      });
    } catch (error) {
      console.error("❌ Error al actualizar las preferencias de notificación:", error);
      throw error;
    }
  },
};
