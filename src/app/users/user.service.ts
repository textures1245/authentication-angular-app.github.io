import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../auth/user.model';

export interface UserTable {
  email: string;
  password: string;
  _tokenExpirationDate: Date;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}
  _userChanged = new Subject<User[]>();

  private users: User[] = [];

  getUsers() {
    return this.users.slice();
  }

  setUsers(users: User[]) {
    this.users = users.map((user) => {
        let currentUserData: object | any = JSON.parse(<any>localStorage.getItem('userData'));
        if (user.email == currentUserData['email']) {
            user.status = true;
        } else {
            user.status = false;
        }
        return new User(
            user.email,
            user.password,
            user.token,
            user._tokenExpirationDate,
            user.status
        );
    });
    this._userChanged.next(this.users.slice());
  }

  addUser(
    email: string,
    password: string,
    token: string,
    tokenExpirationDate: Date
  ) {
    this.users.push(new User(email, password, token, tokenExpirationDate));
    this._userChanged.next(this.users.slice());
  }
}
