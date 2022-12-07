import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
  FormControl,
  FormGroup,
  FormArray,
} from '@angular/forms';

@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.scss'],
})
export class CheckoutFormComponent implements OnInit {
  checkoutForm = this.createForm();

  constructor(private builder: FormBuilder) {
    this.checkoutForm.valueChanges.subscribe(console.log);
  }

  ngOnInit(): void {}

  private createForm() {
    const form = this.builder.group({
      firstName: this.builder.control('', {
        validators: [Validators.required, Validators.minLength(4)],
      }),
      lastName: this.builder.control(''),
      phoneNumber: this.builder.control(''),
      email: this.builder.control(''),
      emailRepeat: this.builder.control(''),
      hasDiscountCode: this.builder.control(false),
      discountCode: this.builder.control(''),
    });

    form.controls.firstName.statusChanges.subscribe(() => {
      console.log('status changed!')
      if (form.controls.firstName.errors) {
        console.log('there are errors')
      }
    });

    // form.controls.firstName.valueChanges.subscribe(() => {
    //   console.log('status changed!')
    //   if (form.controls.firstName.invalid) {
    //     console.log('there are errors')
    //   }
    // });



    return form;
  }

  sendForm() {
    this.checkoutForm.markAllAsTouched();
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
}
