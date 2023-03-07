import {
  CustomerInfo,
  OrdersService,
  CouponCodesService,
} from './../../../../services';
import { inject, Injectable } from '@angular/core';
import { EMPTY, switchMap, tap } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { UserStateService } from 'src/app/core/user.state.service';
import { SnackbarService } from 'src/app/shared/services';

export type CheckoutForm = {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  phoneNumber: FormControl<string>;
  email: FormControl<string>;
  emailRepeat: FormControl<string>;
  newsletter: FormControl<boolean>;
  discountCode: FormControl<string>;
};

@Injectable({
  providedIn: 'root',
})
export class CheckoutFormService {
  private couponCodeService = inject(CouponCodesService);
  private orderService = inject(OrdersService);
  private userState = inject(UserStateService);
  private snackbarService = inject(SnackbarService);

  sendFormData(
    orderId: string,
    formGroup: FormGroup<CheckoutForm>,
    couponCode: boolean
  ) {
    if (couponCode) {
      return this.couponCodeService
        .updateSelectedCouponCode({ active: false })
        .pipe(
          switchMap((coupon) => {
            return this.orderService.updateOrder(orderId, {
              customerInfo: this.getCustomerFormInfo(formGroup),
              couponCodesId: coupon.id,
            });
          })
        );
    } else {
      return this.orderService.updateOrder(orderId, {
        customerInfo: this.getCustomerFormInfo(formGroup),
      });
    }
  }

  private getCustomerFormInfo(
    formGroup: FormGroup<CheckoutForm>
  ): CustomerInfo {
    return {
      firstName: formGroup.value.firstName!,
      lastName: formGroup.value.lastName!,
      email: formGroup.value.email!,
      phoneNumber: formGroup.value.phoneNumber,
      newsletter: formGroup.value.newsletter,
    };
  }

  fillUserForm(formGroup: FormGroup<CheckoutForm>) {
    return this.userState.user$.pipe(
      tap((user) => {
        formGroup.controls.firstName.setValue(<string>user.firstName);
        formGroup.controls.lastName.setValue(<string>user.lastName);
        formGroup.controls.email.setValue(<string>user.email);
        formGroup.controls.emailRepeat.setValue(<string>user.email);
      })
    );
  }

  setCouponCodeDiscount(discountCode: FormControl<string>) {
    return discountCode.statusChanges.pipe(
      switchMap((status) => {
        if (status === 'VALID') {
          return this.couponCodeService
            .setCouponCodeDiscount(discountCode.value)
            .pipe(
              tap((coupon) => {
                if (coupon.length > 0) {
                  this.snackbarService.openSnackBar(
                    'Kupon został aktywowany pomyślnie!',
                    5000
                  );
                }else {
                  this.couponCodeService.resetCouponState()
                }
              })
            );
        } else {
          this.couponCodeService.resetCouponState();
          return EMPTY;
        }
      })
    );
  }

  couponActivationMessage(formControl: FormControl<string>) {
    return formControl.valueChanges.pipe(
      tap(() => {
        if (
          (formControl.touched && formControl.valid, formControl.value !== '')
        ) {
          this.snackbarService.openSnackBar(
            'Kupon został aktywowany pomyślnie!',
            5000
          );
        }
      })
    );
  }
}
