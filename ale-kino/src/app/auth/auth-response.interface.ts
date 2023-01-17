export interface AuthResponse {
  id: number;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponseLearn {
  accessToken: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}
