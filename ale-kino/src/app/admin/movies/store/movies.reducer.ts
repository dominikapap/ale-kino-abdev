import { createReducer, on } from '@ngrx/store';
import { MoviesAPIActions } from './movies.actions';
import { initialMoviesState } from './movies.state';

export const moviesReducer = createReducer(
  initialMoviesState,

  on(MoviesAPIActions.addNewMovieSuccess, (state, action) => {
    return { ...state, moviesList: [...state.moviesList, action] };
  }),
  on(MoviesAPIActions.getAllMovieSuccess, (state, { moviesList }) => ({
    ...state,
    moviesList: [...state.moviesList, ...moviesList],
  }))
);
