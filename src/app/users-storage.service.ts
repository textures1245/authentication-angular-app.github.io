import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from './users/user.service';
import { User } from './auth/user.model';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserStorageService {
  constructor(private userService: UserService, private http: HttpClient) {}

  database =
    'https://authenticated-10a31-default-rtdb.firebaseio.com/users.json';

  storeUsers() {
    const users: User[] = this.userService.getUsers();
    this.http.put<User[]>(this.database, users).subscribe((res) => {
      alert('Store data succuss');
      console.log('Store data succuss, here response', res);
    });
  }

  fetchUsers() {
    this.http
      .get<User[]>(this.database)
      .pipe(
        tap((users: User[]) => {
          this.userService.setUsers(users);
        })
      )
      .subscribe((res) => {
        console.log('Fetch data succuss', res);
      });
  }
}
