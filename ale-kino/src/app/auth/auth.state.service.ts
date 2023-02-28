import { AuthResponse } from './auth-response.interface';
import { BehaviorSubject, combineLatest, map, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User, UserStateService } from '../core/user.state.service';

export type AuthState = {
  hasAuth: boolean;
  role: string;
};

export type Role = {
  id: string;
  type: string;
};

const userAuthStateDefault = {
  hasAuth: false,
  role: 'guest',
};

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private userStateService = inject(UserStateService);

  constructor() {
    this.setStateFromLocalStorage();
  }

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

  login(credentials: { email: string; password: string }) {
    return this.http
      .post<AuthResponse>('/login', {
        email: credentials.email,
        password: credentials.password,
      }, {withCredentials: true})
      .pipe(
        switchMap((res) => {
          const obs = this.http.get<Role[]>(
            `/roles?id=${(<AuthResponse>res).user.rolesId}`
          );
          return combineLatest([of(res), obs]);
        }),
        tap({
          next: ([userData, roleData]) => {
            const role = roleData[0].type;
            const user: User = {
              id: userData.user.id.toString(),
              email: userData.user.email,
              username: userData.user.username,
              firstName: userData.user.firstName,
              lastName: userData.user.lastName,
              ratedMovies: userData.user.ratedMovies,
              movieWatchList: userData.user.movieWatchList,
            };

            this.userStateService.addUser(user);
            this.patchState({ hasAuth: true, role: role });
            localStorage.setItem('token', userData.accessToken);
            localStorage.setItem('role', role);
            localStorage.setItem('user', JSON.stringify(user));

            this.router.navigate(['']);
          },
          error: () => {
            alert('error');
          },
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    this.patchState({ hasAuth: false, role: 'guest' });
    this.router.navigate(['']);
  }

  private setStateFromLocalStorage() {
    // naive checking
    if (localStorage.getItem('token')) {
      this.patchState({ hasAuth: true });

      const role = localStorage.getItem('role');
      if (role) {
        this.patchState({ role });
      }

      const userFromLS = localStorage.getItem('user');
      if (userFromLS) {
        this.userStateService.addUser(JSON.parse(userFromLS));
      }
    }
  }
}
