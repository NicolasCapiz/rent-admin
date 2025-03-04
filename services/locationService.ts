import { useAuth } from "../composables/useAuth";

const apiBaseURL = "http://localhost:3307"; // Cambia esto según tu configuración


export const locationService = {
  // Función para obtener todas las localidades
  async getAllLocations() {
    const auth = useAuth();
    const token = auth.getToken();
    try {
      if (!token) {
        throw new Error("Token no encontrado");
      }

      const response = await $fetch(`${apiBaseURL}/locations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Agregar el token en los headers
        },
      });

      return response;
    } catch (error) {
      console.error("Error al obtener las localidades:", error);
      throw new Error("Error al obtener las localidades. Verifica tu conexión o credenciales.");
    }
  },

  // Función para obtener detalles de una localidad por ID
  async getLocationById(locationId: number) {
    const auth = useAuth();
const token = auth.getToken();
    try {
      if (!token) {
        throw new Error("Token no encontrado");
      }

      const response = await $fetch(`${apiBaseURL}/locations/${locationId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response;
    } catch (error) {
      console.error(`Error al obtener la localidad con ID ${locationId}:`, error);
      throw new Error("Error al obtener la localidad. Verifica tu conexión o credenciales.");
    }
  },

  // Función para crear una nueva localidad (opcional)
  async createLocation(data: { name: string; address: string }) {
    const auth = useAuth();
const token = auth.getToken();
    try {
      if (!token) {
        throw new Error("Token no encontrado");
      }

      const response = await $fetch(`${apiBaseURL}/locations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      return response;
    } catch (error) {
      console.error("Error al crear una nueva localidad:", error);
      throw new Error("Error al crear la localidad. Verifica los datos ingresados.");
    }
  },

  // Función para eliminar una localidad por ID (opcional)
  async deleteLocation(locationId: number) {
    const auth = useAuth();
const token = auth.getToken();
    try {
      if (!token) {
        throw new Error("Token no encontrado");
      }

      const response = await $fetch(`${apiBaseURL}/locations/${locationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response;
    } catch (error) {
      console.error(`Error al eliminar la localidad con ID ${locationId}:`, error);
      throw new Error("Error al eliminar la localidad. Verifica tu conexión o credenciales.");
    }
  },
};