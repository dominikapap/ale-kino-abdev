import { AuthResponseLearn } from './auth-response.interface';
import { BehaviorSubject, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User, UserStateService } from '../core/user.state.service';

export type AuthState = {
  hasUserAuth: boolean;
  hasAdminAuth: boolean;
};

const userAuthStateDefault = {
  hasUserAuth: false,
  hasAdminAuth: false,
};

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private userStateService = inject(UserStateService);

  constructor() {}

  private auth$$ = new BehaviorSubject<AuthState>(userAuthStateDefault);

  get auth$() {
    return this.auth$$.asObservable();
  }

  get authValue() {
    return this.auth$$.value;
  }

  private patchState(stateSlice: Partial<AuthState>) {
    this.auth$$.next({
      ...this.auth$$.value,
      ...stateSlice,
    });
  }

  private getUserData(response: any) {
    if (response.length > 0) {
      //if the credential data was correct
      const res = response[0];
      return <User>{
        id: res.id,
        email: res.email,
        password: res.password,
        role: res.roles.type,
      };
    }
    return {}; //if the credential data was incorrect
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
              if (user.role === 'user') {
                this.patchState({ hasUserAuth: true });
              } else if (user.role === 'admin') {
                this.patchState({ hasAdminAuth: true });
              }
              this.userStateService.addUser(user);
              console.log('logging in...');
              this.router.navigate(['/']);
              return;
            }
            console.log('the data was incorrect...');
          },
        })
      );
  }

  loginLearn(credentials: { email: string; password: string }) {
    return this.http
      .post<AuthResponseLearn>('http://localhost:3000/login', {
        email: credentials.email,
        password: credentials.password,
      })
      .pipe(
        tap({
          next: (res) => {
            console.log('res', res);
            const { accessToken, user } = res;
            // this.userStateService.addUser(user);
            // this.auth$$.next({ hasAuth: true });
            // localStorage.setItem('token', accessToken);
            // localStorage.setItem('user', JSON.stringify(user));

            // this.router.navigate(['']);
          },
          error: () => {
            alert('error');
          },
        })
      );
  }

  logout() {
    this.patchState({ hasUserAuth: false, hasAdminAuth: false });
  }
}
