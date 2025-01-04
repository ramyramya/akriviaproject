import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import { Inject } from '@angular/core';
import { APP_CONFIG_SERVICE } from '../../AppConfig/appconfig.service';
import { AppConfig } from '../../AppConfig/appconfig.interface';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, @Inject(APP_CONFIG_SERVICE) private config : AppConfig) { }

  Login(username: string, password: string): Observable<any> {
    const obj = {
      username: username,
      password: password
    };

    return this.http.post<any>(`${this.config.apiEndpoint}/login`, obj).pipe(
      map(response => {
        console.log(response);
        //return (JSON.stringify(response));
        return response;
      }), 
      catchError(error => {
        console.error('Error:', error);
        return of({message: 'An error occurred while logging in.'});
      })
    );
  }
}
