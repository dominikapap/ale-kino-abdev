import { Injectable } from '@angular/core';
import { User } from './../user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: User = {
    username: 'Nameless',
    type: {
      isUser: false,
      isAdmin: false,
    },
  };

  subject = new BehaviorSubject<User>(this.user);

  getUser() {
    return this.user;
  }


  constructor() {}
}
