export const paymentService = {
  async createPayment(paymentData: any) {
    const auth = useAuth();
    const token = auth.getToken();
    
    return await $fetch(`/payments`, {
      method: "POST",
      baseURL: "http://localhost:3307",
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
        baseURL: "http://localhost:3307",
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