import { ButtonComponent } from '../user/features/ui/button/button.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { TrimDirective } from '../shared/directives';

@NgModule({
  declarations: [LoginFormComponent],
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    RouterModule,
    CommonModule,
    UpperCasePipe,
    TrimDirective,
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
