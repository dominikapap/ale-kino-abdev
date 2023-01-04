import { BehaviorSubject, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthResponse } from './auth-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private http = inject(HttpClient);
  private router = inject(Router);

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

  private getUserRole(response:any){
    if (response.length > 0) {
      return response[0].roles.type;
    }
    return response;
  }

  login(credentials: { email: string; password: string }) {
    return this.http
      .get<any>(
        `http://localhost:3000/users?_expand=roles&email=${credentials.email}&password=${credentials.password}`
      )
      .pipe(
        map((res) => {
          return this.getUserRole(res);
        }),
        tap({
          next: (res) => {
            console.log('tap', res);
            if (res.length > 0) {
              this.auth$$.next({ hasAuth: true });
              console.log('logging in...');
              return;
            }
            console.log('the data was incorrect...');
          },
        })
      );
  }
}
