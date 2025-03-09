
import { useRuntimeConfig } from "nuxt/app";

const config = useRuntimeConfig();
const apiBaseURL = config.public.apiBase as string;
export const paymentMethodService = {
  async getAllPaymentMethods() {
    try {
      return await $fetch("/paymentMethods", {
        method: "GET",
        baseURL: apiBaseURL,
      });
    } catch (error) {
      console.error("❌ Error fetching payment methods:", error);
      throw error;
    }
  },
};