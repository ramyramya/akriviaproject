import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG_SERVICE } from '../../AppConfig/appconfig.service';
import { AppConfig } from '../../AppConfig/appconfig.interface';

interface User {
  id: number|null;
  firstname: string|null;
  lastname: string|null;
  dob: string|null;
  gender: string|null;
  username: string|null;
  email: string|null;
  role: string|null;
  photo: string|null
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient, @Inject(APP_CONFIG_SERVICE) private config: AppConfig) { }

  getLoggedInUser(): Observable<{ success: boolean, userData: User, role: string }> {
    return this.http.get<{ success: boolean, userData: User, role: string }>(`${this.config.apiEndpoint}/home`);
  }

  getUsers(): Observable<{ success: boolean, users: User[] }> {
    return this.http.get<{ success: boolean, users: User[] }>(`${this.config.apiEndpoint}/users`);
  }

  getUserById(userId: number): Observable<{ success: boolean, userData: User }> {
    return this.http.get<{ success: boolean, userData: User}>(`${this.config.apiEndpoint}/getUser/${userId}`);
  }


  deleteUser(userId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.config.apiEndpoint}/users/${userId}`);
  }
}
