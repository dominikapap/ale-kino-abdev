import { ButtonComponent } from './../features/ui/button/button.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, UpperCasePipe } from '@angular/common';

@NgModule({
  declarations: [LoginFormComponent],
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    RouterModule,
    CommonModule,
    UpperCasePipe,
    RouterModule.forChild([
      {
        path: '',
        component: LoginFormComponent,
        children: [],
      },
    ]),
  ],
})
export default class AuthModule {}
