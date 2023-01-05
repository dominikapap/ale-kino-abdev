import { BehaviorSubject, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthResponse } from './auth-response.interface';
import { User, UserStateService } from '../core/user.state.service';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private userStateService = inject(UserStateService);

  constructor() {}

  private auth$$ = new BehaviorSubject<{ hasAuth: boolean }>({
    hasAuth: false,
  });

  get auth$() {
    return this.auth$$.asObservable();
  }

  get authValue() {
    return this.auth$$.value;
  }

  private getUserData(response: any) {
    if (response.length > 0) {//if the credential data was correct
      const res = response[0];
      return <User>{
        id: res.id,
        email: res.email,
        password: res.password,
        role: res.roles.type
      }
    }
    return {};//if the credential data was incorrect
  }

  login(credentials: { email: string; password: string }) {
    return this.http
      .get<any>(
        `http://localhost:3000/users?_expand=roles&email=${credentials.email}&password=${credentials.password}`
      )
      .pipe(
        map((res) => {
          return <User>this.getUserData(res);
        }),
        tap({
          next: (user: User) => {
            console.log('response:', user);
            if (Object.keys(user).length !== 0) {
              this.userStateService.addUser(user);
              this.auth$$.next({ hasAuth: true });
              console.log('logging in...');
              this.router.navigate(['/']);
              return;
            }
            console.log('the data was incorrect...');
          },
        })
      );
  }
}
