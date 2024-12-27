import { Component, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup } from '@angular/forms';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
  }
  userform: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  onLogin() {
    const username = this.userform.value.username;
    const password = this.userform.value.password;
    if (this.loginService.Login(username, password)) {
      alert('Login Success');
    }
    else {
      alert('Login Failed');
    }
  }
}
