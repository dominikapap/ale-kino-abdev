import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { CouponCodesService } from 'src/app/services';
import {
  MAX_COUPON_RATE,
  MAX_NAME_LENGTH,
  MIN_COUPON_RATE,
  MIN_LENGTH,
  NO_STARTING_WHITESPACE,
} from '../../shared/validators-constans';
import { CouponsActions } from '../store';
import { couponNameTakenValidator } from './coupon-name-taken.validator';

type CouponForm = FormGroup<{
  name: FormControl<string>;
  discount: FormControl<number>;
  active: FormControl<boolean>;
}>;

@Component({
  selector: 'app-add-coupon',
  templateUrl: './add-coupon.component.html',
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AddCouponComponent {
  private builder = inject(NonNullableFormBuilder);
  private couponsService = inject(CouponCodesService);
  private store = inject(Store);
  readonly MIN_COUPON_RATE = MIN_COUPON_RATE;
  readonly MAX_COUPON_RATE = MAX_COUPON_RATE;

  couponForm = this.createCouponForm();

  get nameCtrl() {
    return this.couponForm.controls.name;
  }
  get discountCtrl() {
    return this.couponForm.controls.discount;
  }
  get activeCtrl() {
    return this.couponForm.controls.active;
  }

  sendForm() {
    this.couponForm.markAllAsTouched();
    if (this.couponForm.invalid) {
      return;
    }
    this.store.dispatch(
      CouponsActions.addNewCoupon(this.couponForm.getRawValue())
    );
  }

  private createCouponForm(): CouponForm {
    return this.builder.group({
      name: this.builder.control('', {
        validators: [
          Validators.required,
          Validators.maxLength(MAX_NAME_LENGTH),
          Validators.minLength(MIN_LENGTH),
          Validators.pattern(NO_STARTING_WHITESPACE),
        ],
        asyncValidators: [couponNameTakenValidator(this.couponsService)],
        updateOn: 'blur',
      }),
      discount: this.builder.control(0.2, {
        validators: [
          Validators.required,
          Validators.min(MIN_COUPON_RATE),
          Validators.max(MAX_COUPON_RATE),
        ],
      }),
      active: this.builder.control('' as unknown as boolean, {
        validators: [Validators.required],
      }),
    });
  }
}
