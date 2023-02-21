import { Movie } from "src/app/services/movies.service";

export interface MovieScreening {
  date: string;
  id: number;
  movies: Movie;
  moviesId: number;
  screeningRoomsId: number;
  time: string;
}

export interface Screening {
  id: number;
  screeningsRoomId: number;
  date: string;
  time: string;
}

export interface DailyMovieScreenings {
  id: number;
  movieInfo: Movie;
  screenings: Screening[];
}
