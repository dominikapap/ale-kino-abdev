import { Movie } from '../movies-api.service';

export type MoviesState = {
  moviesList: Movie[];
};

export const moviesFeatureKey = 'moviesState';
export const initialMoviesState: {
  moviesList: Movie[];
} = {
  moviesList: [],
};
