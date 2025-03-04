import { useAuth } from '@/composables/useAuth';

const API_BASE_URL = "http://localhost:3307";

export const dashboardService = {
  async getRevenue(filters) {
    const auth = useAuth();
    const token = auth.getToken();
    
    return await $fetch(`${API_BASE_URL}/dashboard/revenue`, {
      method: "GET",
      query: filters,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getOccupancy(filters) {
    const auth = useAuth();
    const token = auth.getToken();
    
    return await $fetch(`${API_BASE_URL}/dashboard/occupancy`, {
      method: "GET",
      query: filters,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getPaymentStatus(filters) {
    const auth = useAuth();
    const token = auth.getToken();
    
    return await $fetch(`${API_BASE_URL}/dashboard/payment-status`, {
      method: "GET",
      query: filters,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getRenterDistribution(filters) {
    const auth = useAuth();
    const token = auth.getToken();
    
    return await $fetch(`${API_BASE_URL}/dashboard/renter-distribution`, {
      method: "GET",
      query: filters,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getRentComparison(filters) {
    const auth = useAuth();
    const token = auth.getToken();
    
    return await $fetch(`${API_BASE_URL}/dashboard/rent-comparison`, {
      method: "GET",
      query: filters,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getDailyRevenue(filters) {
    const auth = useAuth();
    const token = auth.getToken();
    
    return await $fetch(`${API_BASE_URL}/dashboard/daily-revenue`, {
      method: "GET",
      query: filters,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getLocations() {
    const auth = useAuth();
    const token = auth.getToken();
    
    return await $fetch(`${API_BASE_URL}/dashboard/locations`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getPriceAdjustments(filters) {
    const auth = useAuth();
    const token = auth.getToken();
    return await $fetch(`${API_BASE_URL}/dashboard/price-adjustments`, {
      method: "GET",
      query: filters,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
