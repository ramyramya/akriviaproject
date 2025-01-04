import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG_SERVICE } from '../AppConfig/appconfig.service';
import { AppConfig } from '../AppConfig/appconfig.interface';
import { Inject } from '@angular/core';

interface User{
  firstname:'',
  lastname  :'',
  dob:'',
  email:'',
  username:'',
  password:''
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  user : User = {
    firstname:'',
    lastname  :'',
    dob:'',
    email:'',
    username:'',
    password:''
    };

  constructor(private route: Router, private http: HttpClient, @Inject(APP_CONFIG_SERVICE) private config : AppConfig) { }

  ngOnInit(): void {
    //const token = localStorage.getItem('token');
    //console.log(token);
    //if (token) {
      this.http.get<{success: boolean, userData: User}>(`${this.config.apiEndpoint}/home`/*, {
        headers: { Authorization: token }
      }*/).subscribe({
        next: response => {
          console.log(response);
          this.user = response.userData;
        },
        error: error => {
          if (error.status === 403) {
            alert('Token expired or invalid');
            this.route.navigateByUrl('/login');
          }
          else if(error.status === 401){
            alert('You are not authorized to access this page');
            this.route.navigateByUrl('/login');
          }
          else {
            console.error('Error:', error);
            this.route.navigateByUrl('/login');
          }
        }
      });
    //} else {
      //this.route.navigateByUrl('/login');
    //}
  }

}
