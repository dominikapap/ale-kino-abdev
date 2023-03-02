import { ScreeningsApiService } from 'src/app/admin/screenings';
import { CheckoutFormService } from './checkout-form.service';
import { couponCodeValidator } from './codeValidator';
import { Router, ActivatedRoute } from '@angular/router';
import { CouponCodesService, OrdersService } from 'src/app/services';
import { Subscription } from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutFormComponent implements OnInit {
  private couponCodesService = inject(CouponCodesService);
  private builder = inject(NonNullableFormBuilder);
  private router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);
  private checkoutFormService = inject(CheckoutFormService);
  protected orderId$ = inject(OrdersService).getOrderIdFromRoute(
    this.activatedRoute
  );
  protected screeningId$ = inject(ScreeningsApiService).getScreeningIdFromRoute(
    this.activatedRoute
  );

  private readonly MIN_FIRST_NAME_LENGTH = 2;
  private readonly MIN_LAST_NAME_LENGTH = 2;
  private readonly MAX_FIRST_NAME_LENGTH = 30;
  private readonly MAX_LAST_NAME_LENGTH = 30;
  checkoutForm = this.createForm();
  subscriptions = new Subscription();

  constructor() {}

  ngOnInit(): void {
    const userStateSub = this.checkoutFormService
      .fillUserForm(this.checkoutForm)
      .subscribe();
    const couponCodeSub = this.checkoutFormService
      .setCouponCodeDiscount(this.discountCodeCtrl)
      .subscribe();
    this.subscriptions.add(userStateSub);
    this.subscriptions.add(couponCodeSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private createForm() {
    const form = this.builder.group({
      firstName: this.builder.control('', {
        validators: [
          Validators.required,
          Validators.pattern('[a-zA-Z]*'),
          Validators.minLength(this.MIN_FIRST_NAME_LENGTH),
          Validators.maxLength(this.MAX_FIRST_NAME_LENGTH),
        ],
      }),
      lastName: this.builder.control('', {
        validators: [
          Validators.required,
          Validators.pattern('[a-zA-Z]*'),
          Validators.minLength(this.MIN_LAST_NAME_LENGTH),
          Validators.maxLength(this.MAX_LAST_NAME_LENGTH),
        ],
      }),
      phoneNumber: this.builder.control('', {
        validators: [Validators.pattern(/^\d{9}$/), Validators.maxLength(20)],
      }),
      email: this.builder.control('', {
        validators: [Validators.required, Validators.email],
      }),
      emailRepeat: this.builder.control('', {
        validators: [Validators.required, Validators.email],
      }),
      newsletter: this.builder.control(false),
      discountCode: this.builder.control('', {
        updateOn: 'blur',
        asyncValidators: [couponCodeValidator(this.couponCodesService)],
      }),
    });

    return form;
  }

  sendForm(orderId: string) {
    this.checkoutForm.markAllAsTouched();
    if (this.checkoutForm.valid) {
      const sub = this.checkoutFormService
        .sendFormData(orderId, this.checkoutForm, this.couponCode())
        .subscribe(() => {
          this.router.navigate(['/payment/' + orderId]);
        });
      this.subscriptions.add(sub);
    }
  }

  private couponCode() {
    return (
      this.discountCodeCtrl.touched && this.discountCodeCtrl.valid,
      this.discountCodeCtrl.value !== ''
    );
  }

  get firstNameCtrl() {
    return this.checkoutForm.controls.firstName;
  }
  get lastNameCtrl() {
    return this.checkoutForm.controls.lastName;
  }
  get phoneNumberCtrl() {
    return this.checkoutForm.controls.phoneNumber;
  }
  get emailCtrl() {
    return this.checkoutForm.controls.email;
  }
  get emailRepeatCtrl() {
    return this.checkoutForm.controls.emailRepeat;
  }
  get newsletterCtrl() {
    return this.checkoutForm.controls.newsletter;
  }
  get discountCodeCtrl() {
    return this.checkoutForm.controls.discountCode;
  }

  getNameErrorMessage(
    formControl: FormControl<string>,
    fieldName: 'Imię' | 'Nazwisko'
  ) {
    if (formControl.hasError('required')) {
      return 'To pole jest obowiązkowe';
    }
    return formControl.hasError('maxLength')
      ? ''
      : `Podane ${fieldName} jest zbyt długie`;
  }

  getPhoneNumberErrorMessage() {
    return 'Podany numer telefonu jest nieprawidłowy';
  }

  getEmailErrorMessage() {
    if (this.emailCtrl.hasError('required')) {
      return 'To pole jest obowiązkowe';
    }
    return this.emailCtrl.hasError('email') ? 'Nieprawidłowy adres email' : '';
  }

  getCouponCodeErrorMessage() {
    if (this.discountCodeCtrl.hasError('couponInvalid')) {
      return 'Podany kod jest nieprawidłowy';
    }
    return this.discountCodeCtrl.hasError('couponExpired')
      ? 'Podany kod został już wykorzystany'
      : '';
  }
}
