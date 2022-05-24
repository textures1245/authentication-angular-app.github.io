import { Component, OnDestroy, OnInit } from '@angular/core';
import { finalize, Observable, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit, OnDestroy {
  authState$: Observable<boolean>;
  successAuth = false;
  clearState$ = Subscription.EMPTY;

  constructor(private authService: AuthService) {
    this.authState$ = this.authService.getObservableAuthState();
    this.clearState$ = this.authState$
      .subscribe({
        next: (state) => {
          this.successAuth = state;
        },
        error: (err) => console.log(err),
        complete: () => {
          console.log('complete');
        },
      });  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.clearState$.unsubscribe();
  }
}
