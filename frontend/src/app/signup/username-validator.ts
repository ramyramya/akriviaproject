import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';
import { Inject } from '@angular/core';
import { APP_CONFIG_SERVICE } from '../AppConfig/appconfig.service';
import { AppConfig } from '../AppConfig/appconfig.interface';

@Injectable({ providedIn: 'root' })
export class UsernameValidator {
  constructor(private http: HttpClient, @Inject(APP_CONFIG_SERVICE)private config: AppConfig) { }

  validateUsername(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null); // Don't validate empty values
      }

      /*return control.valueChanges.pipe(debounceTime(1000),
        switchMap(value => {
          return this.http.post<{ exists: boolean }>('http://localhost:3000/check-username', { username: value })
        }),
        map(response => (response.exists ? { usernameExists: true } : null)),
        catchError(() => of(null)) // Handle errors gracefully
      )*/
       return this.http.post<{ exists: boolean }>(`${this.config.apiEndpoint}/check-username`, { username: control.value }).pipe(
         map(response => (response.exists ? { usernameExists: true } : null)),
         catchError(() => of(null)) // Handle errors gracefully
      
        );

       /*return of(control.value).pipe(
        debounceTime(1000),
        switchMap(value => this.http.post<{ exists: boolean }>('http://localhost:3000/check-username', { username: value })),
        map(response => (response.exists ? { usernameExists: true } : null)),
        catchError(() => of(null)) // Handle errors gracefully
      );*/
    };
  }
}
