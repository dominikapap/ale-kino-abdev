import { Subscription } from 'rxjs';
import { User, UserStateService } from './../../../../core/user.state.service';
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
import { ActivatedRoute, Router } from '@angular/router';
import { ScreeningRoomStateService } from 'src/app/services/screening-room.state.service';

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
  private builder = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private userState = inject(UserStateService);
  checkoutForm = this.createForm();
  isError: boolean = false;
  subscriptions = new Subscription();

  private readonly MAX_FIRST_NAME_LENGTH = 30;
  private readonly MAX_LAST_NAME_LENGTH = 30;

  constructor() {}

  ngOnInit(): void {
    const userStateSub = this.userState.user$.subscribe((userState) => {
      this.firstNameCtrl.setValue(<string>userState.firstName);
      this.lastNameCtrl.setValue(<string>userState.lastName);
      this.emailCtrl.setValue(<string>userState.email);
      this.emailRepeatCtrl.setValue(<string>userState.email);
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
          Validators.maxLength(this.MAX_FIRST_NAME_LENGTH),
        ],
      }),
      lastName: this.builder.control('', {
        validators: [
          Validators.required,
          Validators.pattern('[a-zA-Z]*'),
          Validators.maxLength(this.MAX_LAST_NAME_LENGTH),
        ],
      }),
      phoneNumber: this.builder.control('', {
        validators: [Validators.pattern('[0-9]{9}'), Validators.maxLength(20)],
      }),
      email: this.builder.control('', {
        validators: [Validators.required, Validators.email],
      }),
      emailRepeat: this.builder.control('', {
        validators: [Validators.required, Validators.email],
      }),
      hasDiscountCode: this.builder.control(false),
      discountCode: this.builder.control(''),
    });

    return form;
  }

  sendForm() {
    this.checkoutForm.markAllAsTouched();
    if (this.checkoutForm.valid) {
      this.router.navigate(['/summary']);
    }
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

  total = 0;
  getTotal(ticketPrice: number) {
    this.total += ticketPrice;
    return this.total;
  }

  // initializeOrderDetailsFromRoute(route: ActivatedRoute) {
  //   return route.paramMap
  //     .pipe(
  //       switchMap((params) => {
  //         const id: string = <string>params.get('id');
  //         return this.screeningService.getScreeningDetails(id);
  //       })
  //     )
  //     .subscribe(([screeningDetails]) => {
  //       this.patchState({ screeningDetails });
  //     });
  // }
}
