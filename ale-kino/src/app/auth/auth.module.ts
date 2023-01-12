import { ButtonComponent } from './../features/ui/button/button.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [LoginFormComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonComponent,
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
