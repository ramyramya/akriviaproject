import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private route: Router, private http: HttpClient) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.http.get('http://localhost:3000/home', {
        headers: { Authorization: token }
      }).subscribe({
        next: response => {
          console.log(response);
        },
        error: error => {
          if (error.status === 403) {
            alert('Token expired or invalid');
            this.route.navigateByUrl('/login');
          }
        }
      });
    } else {
      this.route.navigateByUrl('/login');
    }
  }

}
