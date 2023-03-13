import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { map } from 'rxjs';
import { CouponCodesService } from 'src/app/services';

export function couponNameTakenValidator(
  couponService: CouponCodesService
): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return couponService
      .checkIfNameTaken(control.value)
      .pipe(
        map((namesList) => (namesList.length == 0 ? null : { nameTaken: true }))
      );
  };
}
