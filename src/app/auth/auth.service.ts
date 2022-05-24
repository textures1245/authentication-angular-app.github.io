import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Error } from './error.model';
import {
  BehaviorSubject,
  catchError,
  ReplaySubject,
  Subject,
  tap,
  throwError,
} from 'rxjs';
import { User } from './user.model';
import { UserStorageService } from '../users-storage.service';
import { UserService } from '../users/user.service';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  signUpApi =
    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBDnfKTPgj67NNDItTUfUxbiKU6C4pYby8';
  loggedInApi =
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBDnfKTPgj67NNDItTUfUxbiKU6C4pYby8';

  _user = new BehaviorSubject<User>(null);
  _successAuth = new ReplaySubject<boolean>(1);
  private expDurationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.signUpApi, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.errorHandler),
        tap((resData) => {
          const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
          this.userService.addUser(resData.email, resData.localId, resData.idToken, expirationDate);
          this.authHandler(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  loggedIn(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.loggedInApi, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.errorHandler),
        tap((resData) => {
          this.authHandler(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  logout() {
    this._user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.expDurationTimer) {
      clearTimeout(this.expDurationTimer);
    }
    this.expDurationTimer = null;
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(<any>localStorage.getItem('userData'));

    if (!userData) {
      return;
    }
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this._user.next(loadedUser);
      let expDurationLeft =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expDurationLeft);
    }
  }

  autoLogout(exp_duration: number) {
    this.expDurationTimer = setTimeout(() => {
      this.logout();
    }, exp_duration);
  }

  getObservableAuthState() {
    return this._successAuth.asObservable();
  }

  private authHandler(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this._user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private errorHandler(errorRes: HttpErrorResponse) {
    let errorObj: Error = {
      status: 0,
      message: '',
      name: '',
      messageHeader: '',
    };
    if (!errorRes.error || !errorRes.error.error) {
      errorObj = {
        status: errorRes.status,
        message: errorRes.message,
        name: errorRes.name,
      };
      return throwError(errorObj);
    }
    if (errorRes.error.error.message) {
      errorObj = {
        status: errorRes.status,
        message: errorRes.message,
        name: errorRes.name,
        messageHeader: errorRes.error.error.message,
      };
    }
    return throwError(errorObj);
  }
}
