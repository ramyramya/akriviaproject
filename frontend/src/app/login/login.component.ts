import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService: LoginService, private route: Router) { }

  ngOnInit(): void {
  }

  userform: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  onLogin() {
    const username = this.userform.value.username;
    const password = this.userform.value.password;
    this.loginService.Login(username, password).subscribe(response => {
      if (response.message === 'Login successful') {
        console.log("ok");
        localStorage.setItem('token', response.token);
        this.route.navigateByUrl('/home');
      } else {
        console.log("not ok");
        alert(response.message);
        this.userform.reset();
      }
    });
  }
}
