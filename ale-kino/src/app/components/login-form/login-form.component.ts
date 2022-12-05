import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  loginForm = this.createForm();

  constructor(private builder: FormBuilder, private user: UserService, private router: Router) {
    this.loginForm.valueChanges.subscribe(console.log);
  }

  ngOnInit(): void {
    this.user.subject.subscribe();
  }

  private createForm() {
    return this.builder.group({
      username: this.builder.control('', {
        validators: [Validators.required],
      }),
      password: this.builder.control('', {
        validators: [Validators.required],
      }),
    });
  }

  sendLoginForm() {
    this.loginForm.markAllAsTouched();
    this.user.subject.next({
      username: 'Nameless',
      type: {
        isUser: true,
        isAdmin: false,
      },
    });
    this.router.navigate(['/']);
  }
}
