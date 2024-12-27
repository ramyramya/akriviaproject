import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  constructor(private http: HttpClient) { }


  ngOnInit(): void {
  }

  userform: FormGroup = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    username: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')])
  });

  onSubmit() {
    if (this.userform.valid) {
      const userDetails = {
        firstName: this.userform.value.firstname,
        lastName: this.userform.value.lastname,
        username: this.userform.value.username,
        password: this.userform.value.password
      };
      console.log(userDetails);
      //localStorage.setItem(userDetails.username, JSON.stringify(userDetails));
      //alert('User registered successfully!');

      this.http.post('http://localhost:3000/signup', userDetails)
        .subscribe({
          next: response => {
            alert(JSON.stringify(response));
          }, error: error => {
            console.error('Error:', error);
            alert('An error occurred while registering the user.');
          }
        });
    }
  }

}
