import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import { APP_CONFIG_SERVICE } from '../../AppConfig/appconfig.service';
import { AppConfig } from '../../AppConfig/appconfig.interface';
import { login } from '../login.interface';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  token!: string
  isLoggedIn = false;
  
  constructor(private http: HttpClient, @Inject(APP_CONFIG_SERVICE) private config : AppConfig) { 
    this.token = localStorage.getItem("token") || '';
    if(this.token != ''){
      this.isLoggedIn = true;
    }
  }

  login(username: string, password: string, role: string): Observable<any> {
    const obj = {
      username: username,
      password: password,
      role: role
    };
    return this.http.post<login>(`${this.config.apiEndpoint}/login`, obj).pipe(
      tap(response => {
        if (response.token) {
          this.token = response.token;
          localStorage.setItem("token", this.token);
          this.isLoggedIn = true;
        }
      }),
      catchError(error => {
        console.error('Error:', error);
        return of({message: 'An error occurred while logging in.'});
      })
    );
  }
}
