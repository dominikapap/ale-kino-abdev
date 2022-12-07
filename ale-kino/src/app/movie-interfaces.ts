export interface Movie {
  id: number,
  title: string,
  tags: string[],
  length: string,
  rated: string,
  description: string,
  image: string,
  premiere: boolean,
  score: string
}

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
