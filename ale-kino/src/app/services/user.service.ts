import { Injectable } from '@angular/core';
import { User } from './../user';

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

  getUser() {
    return this.user;
  }

  constructor() {}
}
