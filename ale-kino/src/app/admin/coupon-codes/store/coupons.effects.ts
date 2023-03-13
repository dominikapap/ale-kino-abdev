import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, throwError } from 'rxjs';
import { CouponCodesService } from 'src/app/services';
import { SnackbarService } from 'src/app/shared/services';
import { CouponsActions, CouponsApiActions } from '.';

@Injectable()
export class CouponsEffects {
  private actions$ = inject(Actions);
  private couponCodesService = inject(CouponCodesService);
  private snackbarService = inject(SnackbarService);

  addCouponEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CouponsActions.addNewCoupon),
      exhaustMap((action) =>
        this.couponCodesService.addCouponCode(action).pipe(
          catchError((error) => {
            this.snackbarService.openSnackBar(
              'Niestety nie udało się dodać kuponu',
              5000,
              ['snackbar-error']
            );
            return throwError(() => new Error(error));
          })
        )
      ),
      map((coupon) => {
        this.snackbarService.openSnackBar(
          'Kupon został dodany pomyślnie',
          5000
        );
        return CouponsApiActions.addNewCouponSuccess(coupon);
      })
    );
  });

  getCouponsEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CouponsActions.getAllCoupons),
      exhaustMap(() =>
        this.couponCodesService.getAllCouponCodes().pipe(
          catchError((error) => {
            return throwError(() => new Error(error));
          })
        )
      ),
      map((coupons) =>
        CouponsApiActions.getAllCouponsSuccess({ couponsList: coupons })
      )
    );
  });
}
