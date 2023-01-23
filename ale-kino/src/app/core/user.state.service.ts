import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';


export interface User {
  id: number;
  email: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserStateService {

  constructor() { }

  private user$$ = new ReplaySubject<User>(1);

  get user$() {
    return this.user$$.asObservable();
  }

  addUser(user: User) {
    this.user$$.next(user);
  }
}
