import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { login } from './login.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  userform: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  errorMessage: string | null = null;

  constructor(private loginService: LoginService, private route: Router) { }

  ngOnInit(): void {
  }

  onLogin() {
    const username = this.userform.value.username;
    const password = this.userform.value.password;
    this.loginService.login(username, password).pipe(take(1)).subscribe(response => {
      this.handleLoginResponse(response);
    });
  }

  handleLoginResponse(response: login) {
    if (response.message === 'Login successful') {
      console.log("ok");
      alert(response.message);
      this.route.navigateByUrl('/home');
    } else {
      console.log("not ok");
      alert(response.message);
      this.userform.reset();
    }
  }
}
