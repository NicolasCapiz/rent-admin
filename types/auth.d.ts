export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  // Otros campos que pueda tener el usuario
}

export interface AuthResponse {
  user: User;
  access_token: string;
}
