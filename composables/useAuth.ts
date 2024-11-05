import { ref, computed } from "vue";
import { authService } from "../services/authService";
import { User, AuthResponse } from "../types/auth";

export function useAuth() {
  const user = ref<User | null>(null);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      return !!user.value || !!token;
    }
    return !!user.value;
  });

  const login = async (email: string, password: string) => {
    try {
      const response = (await authService.login(email, password)) as AuthResponse;
      user.value = response.user;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.access_token);
      }
      error.value = null;
    } catch (err: any) {
      error.value = err.message || "Error al iniciar sesión";
    }
  };

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

  const logout = () => {
    user.value = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  };

  if (typeof window !== "undefined" && localStorage.getItem("token")) {
    const fetchUser = async () => {
      try {
        const response = (await authService.getUserDetails()) as User;
        user.value = response;
      } catch (err: any) {
        error.value = "No se pudo obtener los detalles del usuario";
        logout();
      }
    };

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
