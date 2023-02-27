import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Movie } from '../movies-api.service';

export const MoviesActions = createActionGroup({
  source: 'Movies',
  events: {
    'add new movie': props<Movie>(),
    'get all movies': emptyProps(),
  },
});

export const MoviesAPIActions = createActionGroup({
  source: 'Movies API',
  events: {
    ['add new movie success']: props<Movie>(),
    ['add new movie failure']: emptyProps(),
    ['get all movie success']: props<{ moviesList: Movie[] }>(),
    ['get all movie failure']: emptyProps(),
  },
});
