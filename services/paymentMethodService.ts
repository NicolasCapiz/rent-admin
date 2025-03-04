export const paymentMethodService = {
  async getAllPaymentMethods() {
    try {
      return await $fetch("/paymentMethods", {
        method: "GET",
        baseURL: "http://localhost:3307",
      });
    } catch (error) {
      console.error("❌ Error fetching payment methods:", error);
      throw error;
    }
  },
};