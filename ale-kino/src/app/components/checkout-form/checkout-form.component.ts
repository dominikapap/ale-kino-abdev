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
  styleUrls: ['./checkout-form.component.scss']
})
export class CheckoutFormComponent implements OnInit {

  checkoutForm = this.createForm();

  constructor(private builder: FormBuilder) { }

  ngOnInit(): void {
  }

  private createForm() {
    const form = this.builder.group({
      firstName: this.builder.control(''),
      lastName: this.builder.control(''),
      phoneNumber: this.builder.control(''),
      email: this.builder.control(''),
      emailRepeat: this.builder.control(''),
      hasDiscountCode: this.builder.control(false),
      discountCode: this.builder.control(''),
    });

    return form;
  }

  sendForm() {
    this.checkoutForm.markAllAsTouched();

    // if (this.checkoutForm.invalid) {
    //   return;
    // }

    // // handle...
    // console.log(this.teamForm.value);
  }

}
