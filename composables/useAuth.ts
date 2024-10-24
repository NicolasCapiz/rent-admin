import { ref, computed } from "vue";
import { authService } from "../services/authService";
import { User, AuthResponse } from "../types/auth";

export function useAuth() {
  const user = ref<User | null>(null);
  const error = ref<string | null>(null);

  // Computed para verificar si el usuario está autenticado
  const isAuthenticated = computed(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      console.log("user.value", user.value);
      console.log("localStorage token", token);
      return !!user.value || !!token;
    }
    return !!user.value;
  });

  // Función de login
  const login = async (email: string, password: string) => {
    try {
      const response = (await authService.login(email, password)) as AuthResponse;
      user.value = response.user;
      if (typeof window !== "undefined") {
        console.log("mi response", response);
        console.log("seteando token", response.access_token);

        localStorage.setItem("token", response.access_token); // Guardar el token en localStorage
      }
      error.value = null;
    } catch (err: any) {
      error.value = err.message || "Error al iniciar sesión";
    }
  };

  // Función de registro
  const register = async (email: string, password: string, name: string) => {
    try {
      const response = (await authService.register(email, password, name)) as AuthResponse;
      user.value = response.user;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.access_token); // Guardar el token
      }
      error.value = null;
    } catch (err: any) {
      error.value = err.message || "Error en el registro";
    }
  };

  // Función de logout
  const logout = () => {
    user.value = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("token"); // Remover el token de localStorage
    }
  };

  // Verificar si hay un token en localStorage al cargar el hook
  if (typeof window !== "undefined" && localStorage.getItem("token")) {
    // Intentar obtener la información del usuario autenticado usando el token
    const fetchUser = async () => {
      try {
        const response = (await authService.getUserDetails()) as User;
        user.value = response; // Asignar los detalles del usuario al estado `user`
      } catch (err: any) {
        console.error("Error fetching user details:", err.message);
        error.value = "No se pudo obtener los detalles del usuario";
        logout(); // En caso de error, se hace logout eliminando el token
      }
    };

    // Llamar a la función para obtener los detalles del usuario
    fetchUser();
  }

  return {
    user,
    error,
    isAuthenticated,
    login,
    register,
    logout,
  };
}
