import { ChangeDetectionStrategy,Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsernameValidator } from './username-validator';
import { debounceTime, first, switchMap } from 'rxjs/operators';
import { APP_CONFIG_SERVICE } from '../AppConfig/appconfig.service';
import { AppConfig } from '../AppConfig/appconfig.interface';
import { Subscription } from 'rxjs';
import { User } from '../home/home.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class SignupComponent implements OnInit, OnDestroy {

  private subscription : Subscription|null = null;
  private subscription1 : Subscription|null = null;
  userform!: FormGroup;
  userId: number | null = null;
  isEditMode: boolean = false;
  //selectedFile: File | null = null;
  hide: boolean = true;
  selectedFileBase64: string | null = null;
  existing_photo: string | null = null;
  user: User = {
    id: 0,
    firstname: '',
    lastname: '',
    dob: '',
    gender: '',
    username: '',
    email: '',
    role: '',
    photo: ''
  }

  constructor(
    private http: HttpClient,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private usernameValidator: UsernameValidator,
    @Inject(APP_CONFIG_SERVICE) private config: AppConfig
  ) { }

  ngOnInit(): void {
    this.userform = new FormGroup({
      id: new FormControl({ value: '', disabled: true }),
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      username: new FormControl('', { validators: Validators.required, asyncValidators: this.usernameValidator.validateUsername(), updateOn: 'blur' }),
      email: new FormControl('', Validators.email),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
      ])
    });


    const usernameControl = this.userform.get('username');
    if (usernameControl) {
      this.subscription1 = usernameControl.valueChanges.pipe(
        debounceTime(1000),
        switchMap(value => this.usernameValidator.validateUsername()(usernameControl))
      ).subscribe((response) => {
        usernameControl.setErrors(response);
      });
    }

    this.activatedRoute.queryParams.subscribe(params => {
      if (params['id']) {
        this.userId = +params['id'];
        this.isEditMode = true;
        this.loadUserDetails(this.userId);
      }
    });
  }

  /*onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }*/
    onFileChange(event: any) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedFileBase64 = e.target.result.split(',')[1]; // Get Base64 string
        };
        reader.readAsDataURL(file);
      }
    }

  loadUserDetails(userId: number): void {
    this.http.get<any>(`${this.config.apiEndpoint}/getUser/${userId}`).subscribe({
      next: response => {
        if (response.success) {
          this.user = response.userData;
          this.existing_photo = this.user.photo;
          this.user.photo = `data:image/png;base64,${this.user.photo}`; // Construct Base64 image URL
          this.userform.patchValue(response.userData);
          this.userform.get('password')?.clearValidators();
          this.userform.get('password')?.updateValueAndValidity();
        } else {
          alert('Failed to load user details');
        }
      },
      error: error => {
        alert('An error occurred while loading user details');
      }
    });
  }

  togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }

  onSubmit() {
    console.log(this.userform.valid);
    console.log(this.userform);
    let userDetails: { [key: string]: any } = {};
    if (this.userform.valid) {
      if(!this.isEditMode) {
        console.log('DOB:', this.userform.value.dob);
      userDetails = {
        firstName: this.userform.value.firstname,
        lastName: this.userform.value.lastname,
        //dob: new Date(this.userform.value.dob).toISOString().split('T')[0], // Ensure dob is in YYYY-MM-DD format
        dob: (() => {
          const inputDate = new Date(this.userform.value.dob);
          const adjustedDate = new Date(inputDate.getTime() - inputDate.getTimezoneOffset() * 60000);
          return adjustedDate.toISOString().split('T')[0];
        })(),        
        gender: this.userform.value.gender,
        username: this.userform.value.username,
        email: this.userform.value.email,
        password: this.userform.value.password,
        photo: this.selectedFileBase64
      }}
      else{
        userDetails = {
          firstName: this.userform.value.firstname,
          lastName: this.userform.value.lastname,
          //dob: new Date(this.userform.value.dob).toISOString().split('T')[0], // Ensure dob is in YYYY-MM-DD format
          dob: (() => {
            const inputDate = new Date(this.userform.value.dob);
            const adjustedDate = new Date(inputDate.getTime() - inputDate.getTimezoneOffset() * 60000);
            return adjustedDate.toISOString().split('T')[0];
          })(),          
          gender: this.userform.value.gender,
          username: this.userform.value.username,
          email: this.userform.value.email,
          photo: this.selectedFileBase64 ? this.selectedFileBase64 : this.existing_photo
      }
    }
      console.log(userDetails);
      console.log(userDetails['dob']);

      /*const formData = new FormData();
      formData.append('userDetails', JSON.stringify(userDetails));
      if (this.selectedFile) {
        formData.append('photo', this.selectedFile);
      }*/

      const endpoint = this.isEditMode ? `${this.config.apiEndpoint}/users/${this.userId}` : `${this.config.apiEndpoint}/signup`;
      const request = this.isEditMode ? this.http.put<any>(endpoint, userDetails) : this.http.post<any>(endpoint, userDetails);

      this.subscription = request.subscribe({
        next: response => {
          alert(response.message);
          if(!this.isEditMode)
            this.route.navigateByUrl('/login');
          else{
            this.route.navigateByUrl('/home');
          }
        }, error: error => {
          console.error('Error:', error);
          alert('An error occurred while processing the request.');
          this.userform.reset();
        }
      });
    }
  }

  ngOnDestroy(): void{
    if(this.subscription){
      this.subscription.unsubscribe();
      console.log("Unsubscribed");
    }
    if(this.subscription1){
      this.subscription1.unsubscribe();
      console.log("Username Checking is unsubscribed");
    }
  }
}


