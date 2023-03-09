import { Subscription } from 'rxjs';
import { Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { AuthStateService } from 'src/app/auth/auth.state.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  authService = inject(AuthStateService);
  builder = inject(NonNullableFormBuilder);
  loginForm = this.createForm();
  emailNotFocused: boolean = false;
  passwordNotFocused: boolean = false;
  subscriptions = new Subscription();

  private createForm() {
    return this.builder.group({
      email: this.builder.control('', {
        validators: [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
        ],
      }),
      password: this.builder.control('', {
        validators: [Validators.required],
      }),
    });
  }

  get emailCtrl() {
    return this.loginForm.controls.email;
  }
  get passwordCtrl() {
    return this.loginForm.controls.password;
  }

  login() {
    this.loginForm.markAllAsTouched();
    const sub = this.authService.login(this.loginForm.getRawValue()).subscribe();
    this.subscriptions.add(sub)
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }

  getEmailErrorMessage() {
    if (this.emailCtrl.hasError('required')) {
      return 'To pole jest obowiązkowe';
    }else {
      return 'Podany adres email jest niepoprawny';
    }
  }
}
