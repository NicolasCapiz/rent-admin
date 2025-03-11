// src/services/leaseContractService.ts
import { useAuth } from "../composables/useAuth";
import { useNuxtApp } from "#app";

import { useRuntimeConfig } from "nuxt/app";

const config = useRuntimeConfig();
const apiBaseURL = config.public.apiBase as string;

export const leaseContractService = {
  /**
   * Obtener todos los contratos de arrendamiento.
   */
  async getLeaseContracts() {
    const auth = useAuth();
    const token = auth.getToken();
    const { $notyf } = useNuxtApp();
    try {
      if (!token) {
        throw new Error("Token no encontrado");
      }
      const response = await $fetch(`${apiBaseURL}/leaseContracts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      // $notyf.success("Contratos obtenidos correctamente");
      return response;
    } catch (error) {
      console.error("Error al obtener los contratos de arrendamiento:", error);
      $notyf.error("Error al obtener los contratos de arrendamiento. Verifica tu conexión o credenciales.");
      throw new Error("Error al obtener los contratos de arrendamiento. Verifica tu conexión o credenciales.");
    }
  },

  /**
   * Obtener un contrato de arrendamiento por ID.
   */
  async getLeaseContract(id: number) {
    const auth = useAuth();
    const token = auth.getToken();
    const { $notyf } = useNuxtApp();
    try {
      if (!token) {
        throw new Error("Token no encontrado");
      }
      const response = await $fetch(`${apiBaseURL}/leaseContracts/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      $notyf.success(`Contrato ${id} obtenido correctamente`);
      return response;
    } catch (error) {
      console.error(`Error al obtener el contrato con ID ${id}:`, error);
      $notyf.error("Error al obtener el contrato. Verifica tu conexión o credenciales.");
      throw new Error("Error al obtener el contrato. Verifica tu conexión o credenciales.");
    }
  },

  /**
   * Crear un contrato de arrendamiento (manual).
   * Se espera un FormData que incluya la información necesaria y el archivo PDF.
   */
  async createLeaseContract(formData: FormData) {
    const auth = useAuth();
    const token = auth.getToken();
    const { $notyf } = useNuxtApp();
    try {
      if (!token) {
        throw new Error("Token no encontrado");
      }
      const response = await $fetch(`${apiBaseURL}/leaseContracts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      $notyf.success("Contrato creado exitosamente");
      return response;
    } catch (error) {
      console.error("Error al crear el contrato:", error);
      $notyf.error("Error al crear el contrato. Verifica tu conexión o los datos ingresados.");
      throw new Error("Error al crear el contrato. Verifica tu conexión o los datos ingresados.");
    }
  },

  /**
   * Actualizar un contrato de arrendamiento por ID.
   */
  async updateLeaseContract(id: number, data: any) {
    const auth = useAuth();
    const token = auth.getToken();
    const { $notyf } = useNuxtApp();
    try {
      if (!token) {
        throw new Error("Token no encontrado");
      }
      const response = await $fetch(`${apiBaseURL}/leaseContracts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });
      $notyf.success(`Contrato ${id} actualizado correctamente`);
      return response;
    } catch (error) {
      console.error(`Error al actualizar el contrato con ID ${id}:`, error);
      $notyf.error("Error al actualizar el contrato. Verifica tu conexión o los datos ingresados.");
      throw new Error("Error al actualizar el contrato. Verifica tu conexión o los datos ingresados.");
    }
  },

  /**
   * Eliminar un contrato de arrendamiento por ID.
   */
  async deleteLeaseContract(id: number) {
    const auth = useAuth();
    const token = auth.getToken();
    const { $notyf } = useNuxtApp();
    try {
      if (!token) {
        throw new Error("Token no encontrado");
      }
      const response = await $fetch(`${apiBaseURL}/leaseContracts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      $notyf.success("Contrato eliminado correctamente");
      return response;
    } catch (error) {
      console.error(`Error al eliminar el contrato con ID ${id}:`, error);
      $notyf.error("Error al eliminar el contrato. Verifica tu conexión o credenciales.");
      throw new Error("Error al eliminar el contrato. Verifica tu conexión o credenciales.");
    }
  },

  /**
   * Procesa el PDF enviado para extraer información del contrato.
   * Se espera un FormData con la clave "file".
   */
  async processPdf(formData: FormData) {
    const auth = useAuth();
    const token = auth.getToken();
    const { $notyf } = useNuxtApp();
    try {
      if (!token) {
        throw new Error("Token no encontrado");
      }
      const response = await $fetch(`${apiBaseURL}/leaseContracts/pdf/process`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      $notyf.success("PDF procesado correctamente");
      return response;
    } catch (error) {
      console.error("Error al procesar el PDF:", error);
      $notyf.error("Error al procesar el PDF. Verifica el formato.");
      throw error;
    }
  },

  /**
   * Crea un contrato de arrendamiento a partir de los datos extraídos del PDF.
   * Este endpoint espera un objeto JSON con la información extraída.
   */
  async createFromPdf(dto: any) {
    const auth = useAuth();
    const token = auth.getToken();
    const { $notyf } = useNuxtApp();
    const apiBaseURL = useRuntimeConfig().public.apiBase;

    try {
      if (!token) {
        throw new Error("Token no encontrado");
      }
      const response = await $fetch(`${apiBaseURL}/leaseContracts/createFromData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: dto,
      });
      $notyf.success("Contrato creado a partir de los datos del PDF correctamente");
      return response;
    } catch (error: any) {
      console.error("Error al crear el contrato desde PDF:", error);
      // Construir un mensaje a partir de los errores que venga el backend, o usar uno genérico
      let errorMsg = "Error al crear el contrato desde PDF. Inténtelo nuevamente.";
      if (error?.data?.errors && Array.isArray(error.data.errors)) {
        errorMsg = error.data.errors
          .map((err: any) => `${err.field}: ${err.constraints}`)
          .join(" | ");
      } else if (error?.data?.message) {
        errorMsg = error.data.message;
      } else if (error?.message) {
        errorMsg = error.message;
      }
      $notyf.error(errorMsg);
      throw new Error(errorMsg);
    }
  },


  /**
   * Función adicional para generar el PDF del contrato (si es necesario).
   */
  async generateLeaseContractPdf(contractId: string) {
    const auth = useAuth();
    const token = auth.getToken();
    const { $notyf } = useNuxtApp();
    if (!token) {
      throw new Error("Token no encontrado");
    }
    try {
      const response = await fetch(`${apiBaseURL}/leaseContracts/${contractId}/generatePdf`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Error al generar el contrato PDF");
      }
      $notyf.success("PDF generado correctamente");
      return response.blob();
    } catch (error) {
      console.error("Error al generar el contrato PDF:", error);
      $notyf.error("Error al generar el contrato PDF");
      throw new Error("Error al generar el contrato PDF");
    }
  },
};
