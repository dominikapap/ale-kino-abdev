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

export interface Screening {
  id: number;
  roomId: number;
  date: string;
  time: string;
}

export interface DailyMovieScreenings {
  id: number;
  movieInfo: Movie;
  screenings: Screening[];
}
