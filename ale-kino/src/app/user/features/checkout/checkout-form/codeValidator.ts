import { CouponCodesService } from '../../../../services';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { map, of } from 'rxjs';

export function couponCodeValidator(
  codesService: CouponCodesService
): AsyncValidatorFn {
  return (control: AbstractControl) => {
    if (control.value) {
      return codesService.checkIfCouponCodeValid(control.value).pipe(
        map((code) => {
          if (code) {
            if (code.active === true) {
              return null;
            } else {
              return { couponExpired: true };
            }
          } else {
            return { couponInvalid: true };
          }
        })
      );
    } else {
      return of(null);
    }
  };
}
