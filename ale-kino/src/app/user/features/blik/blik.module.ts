import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BlikPaymentComponent } from '.';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BlikCodeDirective } from 'src/app/shared/directives/blik-code.directive';

@NgModule({
  declarations: [BlikPaymentComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatInputModule,
    BlikCodeDirective,
    RouterModule.forChild([
      {
        path: '',
        component: BlikPaymentComponent,
        children: [],
      },
    ]),
  ],
})
export default class BlikModule {}
