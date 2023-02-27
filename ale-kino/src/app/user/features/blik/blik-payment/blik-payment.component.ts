import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blik-payment',
  templateUrl: './blik-payment.component.html',
  styleUrls: ['./blik-payment.component.scss'],
})
export class BlikPaymentComponent {
  private builder = inject(NonNullableFormBuilder);
  private router = inject(Router);
  blikForm = this.createForm();

  private createForm() {
    const form = this.builder.group({
      blikCode: this.builder.control('', {
        validators: [
          Validators.required,
          Validators.pattern('[0-9]{6}'),
        ],
      }),
    });

    return form;
  }

  get blikCodeCtrl() {
    return this.blikForm.controls.blikCode;
  }

  sendForm() {
    this.blikForm.markAllAsTouched();
    if (this.blikForm.valid) {
      console.log(this.blikForm.value)
      // this.router.navigate(['/summary']);
    }
  }

  getBlikCodeErrorMessage() {
    return 'Podany kod blik jest nieprawidłowy';
  }
}
