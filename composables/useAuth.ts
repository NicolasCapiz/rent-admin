import { ref, computed } from "vue";
import { authService } from "../services/authService";
import { User, AuthResponse } from "../types/auth";

export function useAuth() {
  const user = ref<User | null>(null);
  const error = ref<string | null>(null);

  // const isAuthenticated = computed(() => !!user.value || !!localStorage.getItem("token"));
  const isAuthenticated = true;

  const login = async (email: string, password: string) => {
    try {
      const response = (await authService.login(email, password)) as AuthResponse;
      user.value = response.user;
      localStorage.setItem("token", response.token); // Guardar el token
      error.value = null;
    } catch (err: any) {
      error.value = err.message;
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName?: string
  ) => {
    try {
      const response = (await authService.register(
        email,
        password,
        firstName,
        lastName
      )) as AuthResponse;
      user.value = response.user;
      localStorage.setItem("token", response.token); // Guardar el token
      error.value = null;
    } catch (err: any) {
      error.value = err.message;
    }
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem("token");
  };

  return {
    user,
    error,
    isAuthenticated,
    login,
    register,
    logout,
  };
}
