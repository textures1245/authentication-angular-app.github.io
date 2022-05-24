import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { UserStorageService } from '../users-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuth = false;
  user$ = Subscription.EMPTY
  isShowOption = false;

  constructor(
    private authService: AuthService,
    private userStorageService: UserStorageService
  ) { }

  ngOnInit(): void {
    this.user$ = this.authService._user.subscribe(user => {
      this.isAuth = !!user;
    })
  }

  onShowOption() {
    this.isShowOption = !this.isShowOption;
  }

  onLogout() {
    this.authService.logout();
  }

  onSaveData() {
    this.userStorageService.storeUsers();
  }

  onFetchData() {
    this.userStorageService.fetchUsers();

  }

  ngOnDestroy(): void {
      this.user$.unsubscribe();
  }

}
