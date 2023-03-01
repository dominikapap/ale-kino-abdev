import { SnackbarService } from './../../../shared/services';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, throwError } from 'rxjs';
import { ScreeningsApiService } from '../screenings-api.service';
import { ScreeningsActions, ScreeningsAPIActions } from '.';

@Injectable()
export class ScreeningsEffects {
  private actions$ = inject(Actions);
  private screeningsApiService = inject(ScreeningsApiService);
  private snackbarService = inject(SnackbarService);

  addScreeningEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScreeningsActions.addNewScreening),
      exhaustMap((action) =>
        this.screeningsApiService.addScreening(action).pipe(
          catchError((error) => {
            this.snackbarService.openSnackBar(
              'Niestety nie udało się dodać seansu',
              5000,
              ['snackbar-error']
            );
            return throwError(() => new Error(error));
          })
        )
      ),
      map((movieScreening) => {
        this.snackbarService.openSnackBar(
          'Seans został dodany pomyślnie',
          5000
        );
        return ScreeningsAPIActions.addNewScreeningSuccess(movieScreening);
      })
    );
  });

  getScreeningEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScreeningsActions.getAllScreenings),
      exhaustMap(() =>
        this.screeningsApiService.getAllScreenings().pipe(
          catchError((error) => {
            return throwError(() => new Error(error));
          })
        )
      ),
      map((screenings) =>
      ScreeningsAPIActions.getAllScreeningsSuccess({ screeningsList: screenings })
      )
    );
  });
}
