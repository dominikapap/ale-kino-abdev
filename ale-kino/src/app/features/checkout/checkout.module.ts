import { ButtonComponent } from './../ui/button/button.component';
import { CheckoutFormComponent } from './checkout-form/checkout-form.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf, AsyncPipe, NgFor } from '@angular/common';

@NgModule({
  declarations: [CheckoutFormComponent],
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    NgIf,
    AsyncPipe,
    NgFor,
    RouterModule.forChild([
      {
        path: '',
        component: CheckoutFormComponent,
        children: [],
      },
    ]),
  ],
})
export default class CheckoutModule {}
