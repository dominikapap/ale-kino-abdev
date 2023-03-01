import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, throwError } from 'rxjs';
import { SnackbarService } from 'src/app/shared/services';
import { MoviesApiService } from '../movies-api.service';
import { MoviesActions, MoviesAPIActions } from './movies.actions';

@Injectable()
export class MoviesEffects {
  private actions$ = inject(Actions);
  private moviesApiService = inject(MoviesApiService);
  private snackbarService = inject(SnackbarService);

  addMovieEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MoviesActions.addNewMovie),
      exhaustMap((action) =>
        this.moviesApiService.addMovie(action).pipe(
          catchError((error) => {
            this.snackbarService.openSnackBar(
              'Niestety nie udało się dodać filmu',
              5000,
              ['snackbar-error']
            );
            return throwError(() => new Error(error));
          })
        )
      ),
      map((movie) => {
        this.snackbarService.openSnackBar(
          'Film został dodany pomyślnie',
          5000
        );
        return MoviesAPIActions.addNewMovieSuccess(movie);
      })
    );
  });

  getMoviesEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MoviesActions.getAllMovies),
      exhaustMap(() =>
        this.moviesApiService.getAllMovies().pipe(
          catchError((error) => {
            return throwError(() => new Error(error));
          })
        )
      ),
      map((movies) =>
        MoviesAPIActions.getAllMovieSuccess({ moviesList: movies })
      )
    );
  });
}
