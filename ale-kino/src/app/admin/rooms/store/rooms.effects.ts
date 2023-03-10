import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, throwError } from 'rxjs';
import { RoomsApiService } from 'src/app/services';
import { SnackbarService } from 'src/app/shared/services';

import { RoomsActions, RoomsAPIActions } from './rooms.actions';

@Injectable()
export class RoomsEffects {
  private actions$ = inject(Actions);
  private roomsApiService = inject(RoomsApiService);
  private snackbarService = inject(SnackbarService);

  addRoomEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RoomsActions.addNewRoom),
      exhaustMap((action) =>
        this.roomsApiService.addRoom(action).pipe(
          catchError((error) => {
            this.snackbarService.openSnackBar(
              'Niestety nie udało się dodać sali',
              5000,
              ['snackbar-error']
            );
            return throwError(() => new Error(error));
          })
        )
      ),
      map((room) => {
        this.snackbarService.openSnackBar(
          'Sala została dodana pomyślnie',
          5000
        );
        return RoomsAPIActions.addNewRoomSuccess(room);
      })
    );
  });

  getMoviesEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RoomsActions.getAllRooms),
      exhaustMap(() =>
        this.roomsApiService.getAllRooms().pipe(
          catchError((error) => {
            return throwError(() => new Error(error));
          })
        )
      ),
      map((rooms) => RoomsAPIActions.getAllRoomsSuccess({ roomsList: rooms }))
    );
  });
}
