import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }

  Login(username: string, password: string): boolean {
    const obj ={
      username: username,
      password: password
    }
    //const userDetails = JSON.parse(localStorage.getItem(username) || '{}');
    //return (userDetails.username === username && userDetails.password === password) 
    this.http.post('http://localhost:3000/login', obj)
    .subscribe(response => {
      console.log(JSON.stringify(response));
      return true;
    }, error => {
      console.error('Error:', error);
      return false;
    });
    return true;
  }
}
