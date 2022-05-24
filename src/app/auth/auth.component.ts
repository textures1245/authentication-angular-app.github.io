import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';
import { Error } from './error.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})

export class AuthComponent implements OnInit {
  isLoggedInMode = true;
  isError = false;
  errorObj: Error = { status: null, message: null, name: null, messageHeader: null };
  _successAuth  = new Subject<boolean>();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSwitchMode() {
    this.isLoggedInMode = !this.isLoggedInMode;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    let authObs = new Observable<AuthResponseData>();

    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoggedInMode) {
      authObs = this.authService.loggedIn(email, password);
    } else {
      authObs = this.authService.signUp(email, password);
    }
    
    authObs.subscribe({
      next: (resData) => {
        console.log(resData);
        this._successAuth.next(true);
        this.authService._successAuth.next(true);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isError = true;
        this.errorObj = err;
      },
    });
    
    form.reset();
  }

}
