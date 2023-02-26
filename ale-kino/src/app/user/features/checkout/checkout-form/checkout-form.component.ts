import { User, UserStateService } from './../../../../core/user.state.service';
import { couponCodeValidator } from './codeValidator';
import { Router } from '@angular/router';
import {
  ScreeningRoomStateService,
  CouponCodesService,
  OrdersService,
  CustomerInfo,
} from 'src/app/services';
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
  private screeningRoomStateService = inject(ScreeningRoomStateService);
  protected screeningRoomState$ =
    this.screeningRoomStateService.screeningRoomState$;
  private orderService = inject(OrdersService);
  private codesService = inject(CouponCodesService);
  private builder = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private userState = inject(UserStateService);

  private readonly MIN_FIRST_NAME_LENGTH = 2;
  private readonly MIN_LAST_NAME_LENGTH = 2;
  private readonly MAX_FIRST_NAME_LENGTH = 30;
  private readonly MAX_LAST_NAME_LENGTH = 30;
  checkoutForm = this.createForm();
  subscriptions = new Subscription();

  constructor() {}

  ngOnInit(): void {
    const userStateSub = this.userState.user$.subscribe((userState) => {
      this.fillUserForm(userState);
    });
    this.subscriptions.add(userStateSub);
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
        asyncValidators: [couponCodeValidator(this.codesService)],
        updateOn: 'change',
      }),
    });

    return form;
  }

  sendForm(orderId: number) {
    this.checkoutForm.markAllAsTouched();
    if (this.checkoutForm.valid) {
      this.orderService
        .updateOrder(orderId, this.getCustomerFormInfo())
        .subscribe((response) => {
          console.log('updated order info:', response);
        });
      console.log(orderId);
      console.log(this.checkoutForm.value);
      // this.router.navigate(['/summary']);
    }
  }

  private fillUserForm(user: User) {
    this.firstNameCtrl.setValue(<string>user.firstName);
    this.lastNameCtrl.setValue(<string>user.lastName);
    this.emailCtrl.setValue(<string>user.email);
    this.emailRepeatCtrl.setValue(<string>user.email);
  }

  private getCustomerFormInfo(): CustomerInfo {
    return {
      firstName: this.checkoutForm.value.firstName!,
      lastName: this.checkoutForm.value.lastName!,
      email: this.checkoutForm.value.email!,
      phoneNumber: this.checkoutForm.value.phoneNumber,
      newsletter: this.checkoutForm.value.newsletter,
    };
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
    if (this.discountCodeCtrl.hasError('couponValid')) {
      return 'Podany kod jest nieprawidłowy';
    }
    return this.discountCodeCtrl.hasError('couponExpired')
      ? 'Podany kod został już wykorzystany'
      : '';
  }
}
