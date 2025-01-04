import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsernameValidator } from './username-validator';
import { debounceTime, switchMap } from 'rxjs/operators';
import { APP_CONFIG_SERVICE } from '../AppConfig/appconfig.service';
import { AppConfig } from '../AppConfig/appconfig.interface';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  constructor(private http: HttpClient, private route: Router, private usernameValidator: UsernameValidator, @Inject(APP_CONFIG_SERVICE) private config: AppConfig) { }

  userform!: FormGroup;

  ngOnInit(): void {
    this.userform = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      username: new FormControl('', { validators: Validators.required/*, asyncValidators: this.usernameValidator.validateUsername(), updateOn:'blur' */}),//default  behaviour is change only for async validators
      email: new FormControl('', Validators.email),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
      ])
    });


    this.userform.get('username')?.valueChanges.pipe(
      debounceTime(1000),
      switchMap(value => this.usernameValidator.validateUsername()(this.userform.get('username')!))
    ).subscribe((response) => {
      this.userform.get('username')?.setErrors(response);
    });
  }

  

  onSubmit() {
    console.log(this.userform.valid);
    if (this.userform.valid) {
      const userDetails = {
        firstName: this.userform.value.firstname,
        lastName: this.userform.value.lastname,
        dob: this.userform.value.dob.toISOString().split('T')[0], // Ensure dob is in YYYY-MM-DD format
        gender: this.userform.value.gender,
        username: this.userform.value.username,
        email: this.userform.value.email,
        password: this.userform.value.password
      };
      console.log(userDetails);

      this.http.post<any>(`${this.config.apiEndpoint}/signup`, userDetails)
        .subscribe({
          next: response => {
            alert(response.message);
            this.route.navigateByUrl('/login');
          }, error: error => {
            console.error('Error:', error);
            alert('An error occurred while registering the user.');
            this.userform.reset();
          }
        });
    }
  }
}


