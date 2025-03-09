
import { useRuntimeConfig } from "nuxt/app";

const config = useRuntimeConfig();
const API_BASE_URL = config.public.apiBase as string;
export const paymentService = {
  async createPayment(paymentData: any) {
    const auth = useAuth();
    const token = auth.getToken();

    return await $fetch(`/payments`, {
      method: "POST",
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: paymentData,
    });
  },

  async getPaymentInfo(locationId: number) {
    const auth = useAuth();
    const token = auth.getToken();
    try {
      return await $fetch(`/payments/info?locationId=${locationId}`, {
        method: "GET",
        baseURL: API_BASE_URL,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("❌ Error fetching payment info:", error);
      throw error;
    }
  },
};