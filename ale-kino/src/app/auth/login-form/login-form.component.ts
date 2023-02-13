import { Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStateService } from 'src/app/auth/auth.state.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  authService = inject(AuthStateService)
  builder = inject(NonNullableFormBuilder)
  loginForm = this.createForm();
  emailNotFocused: boolean = false;
  passwordNotFocused: boolean = false;

  private createForm() {
    return this.builder.group({
      email: this.builder.control('test@test.pl', {
        validators: [Validators.required, Validators.email],
      }),
      password: this.builder.control('testtest', {
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
    this.authService.login(this.loginForm.getRawValue()).subscribe();
  }
}
