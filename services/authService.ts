const apiBaseURL = "http://localhost:3307"; // Cambia esto según tu configuración

export const authService = {
  async login(email: string, password: string) {
    try {
      const response = await $fetch(`${apiBaseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          email,
          password,
        },
      });
      return response;
    } catch (error) {
      throw new Error("Error al iniciar sesión");
    }
  },

  async register(email: string, password: string, firstName: string, lastName?: string) {
    try {
      const response = await $fetch(`${apiBaseURL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          email,
          password,
          firstName,
          lastName,
        },
      });
      return response;
    } catch (error) {
      console.error("Error en el registro:", error);
      throw new Error(error.data.message);
    }
  },
};
