import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  Login(username: string, password: string): Observable<any> {
    const obj = {
      username: username,
      password: password
    };

    return this.http.post<any>('http://localhost:3000/login', obj).pipe(
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
