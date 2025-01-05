import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG_SERVICE } from '../../AppConfig/appconfig.service';
import { AppConfig } from '../../AppConfig/appconfig.interface';

interface User {
  id: number;
  firstname: string;
  lastname: string;
  dob: string;
  gender: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient, @Inject(APP_CONFIG_SERVICE) private config: AppConfig) { }

  getLoggedInUser(): Observable<{ success: boolean, userData: User }> {
    return this.http.get<{ success: boolean, userData: User }>(`${this.config.apiEndpoint}/home`);
  }

  getUsers(): Observable<{ success: boolean, users: User[] }> {
    return this.http.get<{ success: boolean, users: User[] }>(`${this.config.apiEndpoint}/users`);
  }

  deleteUser(userId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.config.apiEndpoint}/users/${userId}`);
  }
}
