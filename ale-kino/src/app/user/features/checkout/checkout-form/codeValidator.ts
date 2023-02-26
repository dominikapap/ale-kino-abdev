import { CouponCodesService } from '../../../../services';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { map } from 'rxjs';

export function couponCodeValidator(
  codesService: CouponCodesService
): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return codesService.checkIfCouponCodeValid(control.value).pipe(
      map((code) => {
        if (code) {
          if (code.active === true) {
            return null;
          } else {
            return { couponExpired: true };
          }
        } else {
          return { couponValid: true };
        }
      })
    );
  };
}
