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
import { matchEmailValidator } from './matchEmailValidator';




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
  private checkoutFormService = inject(CheckoutFormService);
  protected activatedRoute = inject(ActivatedRoute);
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
  private readonly EMAIL_REGEX_PATTERN = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
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
        validators: [
          Validators.required,
          Validators.email,
          Validators.pattern(this.EMAIL_REGEX_PATTERN),
        ],
      }),
      emailRepeat: this.builder.control('', {
        validators: [
          Validators.required,
          Validators.email,
          Validators.pattern(this.EMAIL_REGEX_PATTERN),
          matchEmailValidator('email'),
        ],
      }),
      newsletter: this.builder.control(false),
      discountCode: this.builder.control('', {
        updateOn: 'blur',
        asyncValidators: [couponCodeValidator(this.couponCodesService)],
      }),
    });

    return form;
  }

  sendForm(orderId: string, screeningId: string) {
    this.checkoutForm.markAllAsTouched();
    if (this.checkoutForm.valid) {
      const sub = this.checkoutFormService
        .sendFormData(orderId, this.checkoutForm, this.couponCode())
        .subscribe(() => {
          this.router.navigate(['/payment/', screeningId, orderId]);
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
    } else if (formControl.hasError('minlength')) {
      return `Podane ${fieldName} jest zbyt krótkie`;
    } else if (formControl.hasError('maxlength')) {
      return `Podane ${fieldName} jest zbyt długie`;
    } else {
      return '';
    }
  }

  getPhoneNumberErrorMessage() {
    return 'Podany numer telefonu jest nieprawidłowy';
  }

  getEmailErrorMessage(control: FormControl) {
    if (control.hasError('required')) {
      return 'To pole jest obowiązkowe';
    } else if(control.hasError('notMatch')){
      return 'Podany adres email nie jest taki sam';
    }else {
      return 'Podany adres email jest niepoprawny';
    }
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
