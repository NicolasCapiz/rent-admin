const apiBaseURL = "http://localhost:3307"; // Cambia esto según tu configuración

export const authService = {
  // Función para iniciar sesión
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
      console.error("Error al iniciar sesión:", error);
      throw new Error("Error al iniciar sesión. Por favor verifica tus credenciales.");
    }
  },

  // Función para registrar un nuevo usuario
  async register(email: string, password: string, name: string) {
    try {
      const response = await $fetch(`${apiBaseURL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          email,
          password,
          name,
        },
      });
      return response;
    } catch (error) {
      console.error("Error en el registro:", error);
      throw new Error("Error en el registro. Verifica los datos ingresados.");
    }
  },

  // Función para obtener los detalles del usuario autenticado
  async getUserDetails() {
    try {
      const token = localStorage.getItem("token"); // Obtener el token de localStorage
      if (!token) {
        throw new Error("Token no encontrado");
      }

      const response = await $fetch(`${apiBaseURL}/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Agregar el token en los headers
        },
      });
      return response;
    } catch (error) {
      console.error("Error al obtener los detalles del usuario:", error);
      throw new Error("Error al obtener los detalles del usuario. Inicia sesión nuevamente.");
    }
  },
};
