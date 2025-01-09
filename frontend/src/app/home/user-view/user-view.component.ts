import { Component, OnInit, Inject } from '@angular/core';
import { User } from '../home.component'
import { ActivatedRoute } from '@angular/router';
import { HomeService } from '../services/home.service';
import { AppConfig } from 'src/app/AppConfig/appconfig.interface';
import { APP_CONFIG_SERVICE } from 'src/app/AppConfig/appconfig.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {

  constructor(private route: ActivatedRoute, private homeService : HomeService, @Inject(APP_CONFIG_SERVICE)private config: AppConfig) { }

  userId !: number;
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

  ngOnInit(): void {
    console.log("On User-View");
      this.userId = +this.route.snapshot.paramMap.get('id')!;
      this.homeService.getUserById(this.userId).subscribe({
        next: response =>{
          console.log(response);
          if(response.success){
            this.user = response.userData;
            if(this.user.photo){
              this.user.photo = `data:image/png;base64,${this.user.photo}`; // Construct Base64 image URL
            }
            console.log("User:" + this.user);
          }
          else{
            alert("No user Found");
          }
        },
        error: error => {
          alert('An error occurred while getting the user');
        }
      })
  }
}
