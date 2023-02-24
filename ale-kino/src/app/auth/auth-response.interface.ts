export interface AuthResponse {
  accessToken: string;
  user: {
    email: string;
    id: number;
    username: string;
    rolesId: string;
    firstName?: string;
    lastName?: string;
    ratedMovies?: number[];
    movieWatchList?: number[];
  };
}
