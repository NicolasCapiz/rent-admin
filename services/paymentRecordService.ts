// src/services/paymentRecordService.ts
import { useAuth } from "@/composables/useAuth";

const API_BASE_URL = "http://localhost:3307";

export const paymentRecordService = {
  /**
   * Obtiene los registros de PaymentRecord filtrados por año, mes y local.
   * @param filters Objeto con los filtros: { year, month, local }
   * @param token (Opcional) Token de autenticación; si no se pasa, se obtiene de useAuth.
   */
  async getPaymentRecords(filters: any, token?: string) {
    const auth = useAuth();
    const _token = token || auth.getToken();
    try {
      const response = await $fetch(`${API_BASE_URL}/paymentRecords`, {
        method: "GET",
        query: {
          year: filters.year,
          month: filters.month,
          local: filters.local,
        },
        headers: {
          Authorization: `Bearer ${_token}`,
        },
      });
      return response;
    } catch (error) {
      console.error("Error al obtener PaymentRecords:", error);
      throw error;
    }
  },

  /**
   * Obtiene la lista de locales (para usar en filtros).
   */
  async getLocationsList(token?: string) {
    const auth = useAuth();
    const _token = token || auth.getToken();
    try {
      const response = await $fetch(`${API_BASE_URL}/dashboard/locations`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${_token}`,
        },
      });
      return response;
    } catch (error) {
      console.error("Error al obtener la lista de locales:", error);
      throw error;
    }
  },
};
