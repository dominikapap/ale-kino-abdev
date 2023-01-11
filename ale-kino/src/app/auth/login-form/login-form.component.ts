import { Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthStateService } from 'src/app/auth/auth.state.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  authService = inject(AuthStateService)
  builder = inject(NonNullableFormBuilder)
  loginForm = this.createForm();
  emailNotFocused: boolean = false;
  passwordNotFocused: boolean = false;

  constructor (private user: UserService, private router: Router) {
    // this.loginForm.valueChanges.subscribe(console.log);
  }

  ngOnInit(): void {
    this.user.subject.subscribe();
  }

  private createForm() {
    return this.builder.group({
      email: this.builder.control('', {
        validators: [Validators.required, Validators.email],
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
    this.user.subject.next({
      username: 'Nameless',
      type: {
        isUser: true,
        isAdmin: false,
      },
    });
    this.authService.login(this.loginForm.getRawValue()).subscribe();
  }
}
