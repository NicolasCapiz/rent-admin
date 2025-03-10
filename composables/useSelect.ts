import { defineStore } from "pinia";
import { useRuntimeConfig } from "nuxt/app";

interface Option {
  id: string;
  name: string;
}

interface State {
  options: Record<string, Option[]>;
  selected: string | null;
  loading: boolean;
  error: string | null;
}

export const useSelect = defineStore("select", {
  state: (): State => ({
    options: {},
    selected: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchOptions(model: string, token: string) {
      // Obtén la URL base en el contexto de la acción:
      const apiBaseURL = useRuntimeConfig().public.apiBase;
      this.loading = true;
      this.error = null;

      try {
        const res = await fetch(`${apiBaseURL}/${model}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Error fetching options: ${res.statusText}`);
        }

        const data: Option[] = await res.json();
        this.options[model] = data;
      } catch (error: any) {
        console.error("Error in fetchOptions:", error);
        this.error = error.message || "Unknown error";
      } finally {
        this.loading = false;
      }
    },
  },
});
