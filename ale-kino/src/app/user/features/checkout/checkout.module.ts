import { MatButtonModule } from '@angular/material/button';
import { ButtonComponent } from '../ui/button/button.component';
import { CheckoutFormComponent, CheckoutOrderComponent } from '.';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf, AsyncPipe, NgFor, CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NumbersOnlyDirective, LettersOnlyDirective, TrimDirective } from 'src/app/shared/directives';

@NgModule({
  declarations: [CheckoutFormComponent, CheckoutOrderComponent],
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    NgIf,
    AsyncPipe,
    NgFor,
    MatButtonModule,
    MatInputModule,
    MatSlideToggleModule,
    CommonModule,
    NumbersOnlyDirective,
    LettersOnlyDirective,
    TrimDirective,
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
