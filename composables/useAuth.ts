// import { ref, computed } from "vue";
// import { defineStore } from "pinia";
// import { navigateTo, useCookie } from "#app";
// import { useRuntimeConfig } from "nuxt/app";

// export const useAuth = defineStore("auth", () => {
//   // Función para obtener la base URL desde el runtime config
//   // const getApiBaseURL = () => {
//   //   return useRuntimeConfig().public.apiBase;
//   // };
//   const config = useRuntimeConfig();
//   const getApiBaseURL = config.public.apiBase;

//   const user = ref(null);
//   const error = ref<string | null>(null);
//   const isLoading = ref(false);
//   let isFetchingUser = false; // Para evitar llamadas duplicadas

//   // Usa cookie para guardar el token
//   // const token = process.client
//   //   ? useCookie("auth_token", { maxAge: 60 * 60 * 24 * 7 })
//   //   : ref(null);

//   const token = useCookie("auth_token", { maxAge: 60 * 60 * 24 * 7 });

//   // Computed para saber si está autenticado
//   const isAuthenticated = computed(() => !!user.value);

//   // Obtiene el token desde la cookie
//   const getToken = () => token?.value || null;

//   // Verifica si el token ha expirado (JWT)
//   const isTokenExpired = () => {
//     const currentToken = getToken();
//     if (!currentToken) return true;
//     try {
//       const payload = JSON.parse(atob(currentToken.split(".")[1])); // Decodifica JWT
//       return payload.exp * 1000 < Date.now();
//     } catch (err) {
//       console.error("❌ Error decodificando el token:", err);
//       return true;
//     }
//   };

//   // Cierra sesión y elimina el token
//   const logout = () => {
//     if (process.client) {
//       token.value = null;
//     }
//     user.value = null;
//     navigateTo("/login");
//   };

//   const login = async (email: string, password: string): Promise<void> => {
//     const { $notyf } = useNuxtApp();
//     try {
//       console.log("API Base:", useRuntimeConfig().public.apiBase);
//       console.log("🔄 Intentando login...");
//       const response = await $fetch(`${getApiBaseURL()}/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: { email, password },
//       });
//       if (process.client) {
//         token.value = response.access_token;
//       }
//       await getUserDetails();
//       // Verificar que se haya obtenido información del usuario
//       if (!user.value) {
//         throw new Error("No se pudo obtener la información del usuario. Por favor, intente de nuevo.");
//       }
//       $notyf.success("Inicio de sesión exitoso. ¡Bienvenido!");
//       navigateTo("/location");
//     } catch (err: any) {
//       console.error("❌ Error al iniciar sesión:", err);
//       let msg = "Credenciales incorrectas.";
//       if (err?.data?.message) {
//         msg = err.data.message;
//       } else if (err?.message) {
//         msg = err.message;
//       }
//       error.value = msg;
//       $notyf.error(msg);
//     }
//   };

//   const getUserDetails = async () => {
//     if (isFetchingUser || !process.client || !token.value) return;
//     isFetchingUser = true;
//     if (isTokenExpired()) {
//       console.warn("⚠️ Token expirado, cerrando sesión.");
//       logout();
//       return;
//     }
//     try {
//       console.log("🔄 Llamando a /auth/me...");
//       const response = await $fetch(`${getApiBaseURL()}/auth/me`, {
//         method: "GET",
//         headers: { Authorization: `Bearer ${getToken()}` },
//       });
//       user.value = response;
//       console.log("✅ Usuario autenticado:", user.value);
//     } catch (err) {
//       console.error("❌ Error al obtener usuario:", err);
//       logout();
//     } finally {
//       isFetchingUser = false;
//     }
//   };



//   const register = async (email: string, password: string, firstName: string, lastName: string, dni: number) => {
//     // Asumiendo que se ejecuta en el cliente y useNuxtApp está disponible
//     const { $notyf } = useNuxtApp();
//     try {
//       const response = await $fetch(`${getApiBaseURL()}/auth/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: { email, password, firstName, lastName, dni },
//       });
//       // Notificar al usuario de registro exitoso
//       $notyf.success("Registro exitoso. ¡Bienvenido!");
//       return response;
//     } catch (error) {
//       console.error("❌ Error en el registro:", error);
//       // Notificar al usuario del error en el registro
//       $notyf.error("Error en el registro. Verifica los datos ingresados.");
//       throw new Error("Error en el registro. Verifica los datos ingresados.");
//     }
//   };


//   return { user, error, isAuthenticated, isLoading, getUserDetails, login, logout, getToken, register };
// });


import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { navigateTo, useCookie } from "#app";
import { useRuntimeConfig, useNuxtApp } from "nuxt/app";

export const useAuth = defineStore("auth", () => {
  // ✅ Configuración del runtime en la inicialización
  const config = useRuntimeConfig();
  const apiBaseURL = config.public.apiBase;

  const user = ref(null);
  const error = ref<string | null>(null);
  const isLoading = ref(false);
  let isFetchingUser = false;

  // ✅ Manejo de cookies para el token
  const token = useCookie("auth_token", { maxAge: 60 * 60 * 24 * 7 });

  // ✅ Computed de autenticación
  const isAuthenticated = computed(() => !!user.value);

  const getToken = () => token?.value || null;

  const isTokenExpired = () => {
    const currentToken = getToken();
    if (!currentToken) return true;

    try {
      const payload = JSON.parse(atob(currentToken.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch (err) {
      console.error("❌ Error decodificando el token:", err);
      return true;
    }
  };

  const logout = () => {
    if (process.client) {
      token.value = null;
      navigateTo("/login");
    }
    user.value = null;
  };

  const login = async (email: string, password: string): Promise<void> => {
    const { $notyf } = useNuxtApp();

    try {
      console.log("API Base:", apiBaseURL);
      console.log("🔄 Intentando login...");

      const response = await $fetch(`${apiBaseURL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { email, password },
      });

      if (process.client) {
        token.value = response.access_token;
      }

      await getUserDetails();

      if (!user.value) {
        throw new Error("No se pudo obtener la información del usuario. Por favor, intente de nuevo.");
      }

      $notyf.success("Inicio de sesión exitoso. ¡Bienvenido!");

      if (process.client) {
        navigateTo("/location");
      }

    } catch (err: any) {
      console.error("❌ Error al iniciar sesión:", err);

      let msg = "Credenciales incorrectas.";
      if (err?.data?.message) {
        msg = err.data.message;
      } else if (err?.message) {
        msg = err.message;
      }

      error.value = msg;
      $notyf.error(msg);
    }
  };

  const getUserDetails = async () => {
    if (isFetchingUser || !process.client || !token.value) return;

    isFetchingUser = true;

    if (isTokenExpired()) {
      console.warn("⚠️ Token expirado, cerrando sesión.");
      logout();
      isFetchingUser = false;
      return;
    }

    try {
      console.log("🔄 Llamando a /auth/me...");

      const response = await $fetch(`${apiBaseURL}/auth/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      user.value = response;
      console.log("✅ Usuario autenticado:", user.value);

    } catch (err) {
      console.error("❌ Error al obtener usuario:", err);
      logout();
    } finally {
      isFetchingUser = false;
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    dni: number
  ) => {
    const { $notyf } = useNuxtApp();

    try {
      const response = await $fetch(`${apiBaseURL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { email, password, firstName, lastName, dni },
      });

      $notyf.success("Registro exitoso. ¡Bienvenido!");

      return response;

    } catch (error) {
      console.error("❌ Error en el registro:", error);
      $notyf.error("Error en el registro. Verifica los datos ingresados.");

      throw new Error("Error en el registro. Verifica los datos ingresados.");
    }
  };

  return {
    user,
    error,
    isAuthenticated,
    isLoading,
    getUserDetails,
    login,
    logout,
    getToken,
    register,
  };
});
