export interface AuthResponse {
  accessToken: string;
  user: {
    email: string;
    id: number;
    username: string;
    rolesId: string;
  };
}
