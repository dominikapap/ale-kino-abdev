import { state } from '@angular/animations';
import { createSelector } from '@ngrx/store';
import { MoviesState } from './movies.state';

const selectMoviesState = (state: { moviesState: MoviesState }) =>
  state.moviesState;

export const selectMoviesList = createSelector(
  selectMoviesState,
  (state) => state.moviesList
);
