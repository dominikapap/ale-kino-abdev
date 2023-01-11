import { CheckoutFormComponent } from './checkout-form/checkout-form.component';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

@NgModule({
  declarations: [CheckoutFormComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: CheckoutFormComponent,
        children: [],
      },
    ] as Routes),
  ],
  exports: [CheckoutFormComponent]
})
export default class CheckoutModule {}
