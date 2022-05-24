import { Component, OnInit } from '@angular/core';
import { User } from '../auth/user.model';
import { UserService } from './user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = []

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.users = this.userService.getUsers();
    this.userService._userChanged.subscribe(users => {
      this.users = users;
    })
  }

}
