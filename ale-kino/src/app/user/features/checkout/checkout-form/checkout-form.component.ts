import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ScreeningService } from 'src/app/services/screening.state.service';
import { Ticket } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.scss'],
})
export class CheckoutFormComponent implements OnInit {
  screeningTicketState$ = inject(ScreeningService).screeningTicketsState$;
  private builder = inject(FormBuilder);
  private router = inject(Router);
  checkoutForm = this.createForm();
  isError: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  private createForm() {
    const form = this.builder.group({
      firstName: this.builder.control('', {
        validators: [
          Validators.required,
          Validators.pattern('[a-zA-Z]*'),
          Validators.maxLength(20),
        ],
      }),
      lastName: this.builder.control('', {
        validators: [
          Validators.required,
          Validators.pattern('[a-zA-Z]*'),
          Validators.maxLength(20),
        ],
      }),
      phoneNumber: this.builder.control('', {
        validators: [
          Validators.pattern(
            '^[+]?[(]?[0-9]{2}[)]?[s]?[0-9]{2,3}[-s.]?[0-9]{2,3}[-s.]?[0-9]{2,3}$'
          ),
          Validators.maxLength(20),
        ],
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

  total = 0;
  getTotal(ticketPrice: number){
    this.total +=ticketPrice;
    return this.total;
  }
}
