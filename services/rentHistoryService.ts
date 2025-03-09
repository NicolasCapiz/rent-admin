import { useAuth } from "@/composables/useAuth";

import { useRuntimeConfig } from "nuxt/app";

const config = useRuntimeConfig();
const apiBaseURL = config.public.apiBase as string;

export const rentHistoryService = {
  async getRentHistoryByLocation(locationId: number) {
    const auth = useAuth();
    const token = auth.getToken();

    try {
      return await $fetch(`/rentHistory/location/${locationId}`, {
        method: "GET",
        baseURL: apiBaseURL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("❌ Error fetching rent history:", error);
      throw error;
    }
  },
};