import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HomeService } from './services/home.service';
import { AppConfig } from '../AppConfig/appconfig.interface';
import { APP_CONFIG_SERVICE } from '../AppConfig/appconfig.service';
import { Subscription } from 'rxjs';

export interface User {
  id: number|null;
  firstname: string|null;
  lastname: string|null;
  dob: string|null;
  gender: string|null;
  username: string|null;
  email: string|null;
  role: string|null;
  photo: string|null;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  subscription !: Subscription|null;
  getLoggedInUserSubscription !: Subscription|null;
  getUsersSubscription !: Subscription|null;
  deleteUserSubscription !: Subscription|null;
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
  };
  role: string = '';
  ifUser: boolean = false;
  users: User[] = [];
  loggedInUserId: number | null = null;
  displayedColumns: string[] = ['id', 'firstname', 'lastname', 'gender', 'email', 'photo', 'actions'];

  constructor(private route: Router, private homeService: HomeService, @Inject(APP_CONFIG_SERVICE) private config: AppConfig) { }

  ngOnInit(): void {
    console.log("Instantiated");
    this.getLoggedInUser();
    this.getUsers();

    this.subscription = this.route.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url === '/home') {
        this.getUsers();
      }
    });
  }

  getLoggedInUser(): void {
    console.log("getLoggedIn user called");
    this.getLoggedInUserSubscription = this.homeService.getLoggedInUser().subscribe({
      next: response => {
        this.role = response.role;
        this.ifUser = this.role=='user' ? true : false;
        if (response.success) {
          this.user = response.userData;
          console.log(this.user);
          if(response.role === 'user'){
            this.loggedInUserId = response.userData.id;
          }          
          if (this.user.photo) {
            this.user.photo = `${this.config.apiEndpoint}/${this.user.photo}`;
          }
        } else {
          this.route.navigateByUrl('/login');
        }
      },
      error: error => {
        if (error.status === 403) {
          alert('Token expired or invalid');
          localStorage.removeItem("token");
          this.route.navigateByUrl('/login');
        } else if (error.status === 401) {
          alert('Unauthorized Login needed');
          this.route.navigateByUrl('/login');
        } else {
          alert('An error occurred');
          this.route.navigateByUrl('/login');
        }
      }
    });
  }

  getUsers(): void {
    this.getUsersSubscription = this.homeService.getUsers().subscribe({
      next: response => {
        if (response.success) {
          this.users = response.users;
          for(let user of this.users){
            user.photo = `${this.config.apiEndpoint}/${user.photo}`;
          }
          console.log(this.users);
        } else {
          alert('Failed to fetch users');
        }
      },
      error: error => {
        alert('An error occurred while fetching users');
      }
    });
  }

  editUser(userId: number): void {
    // Implement edit user functionality
    this.route.navigate(['/edit-user'], { queryParams: { id: userId } });
    console.log(`Edit user with ID: ${userId}`);
  }
  

  getUser(userId: number):void{
    this.route.navigateByUrl(`/home/${userId}`);
  }

  deleteUser(userId: number, ifUser: boolean): void {
    this.deleteUserSubscription = this.homeService.deleteUser(userId).subscribe({
      next: response => {
        //alert(response.message);
        
        if(ifUser && response.message){
          this.route.navigateByUrl('/logout');
        }
        if(!ifUser){
          alert("User Deleted");
          this.route.navigateByUrl('/home');
        }
      },
      error: error => {
        alert('An error occurred while deleting the user');
      }
    });
  }



  downloadFile(): void {
    if (this.users.length === 0) {
      alert('No data to download!');
      return;
    }
  
    const csvData = this.convertToCSV(this.users);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users-data.csv';
    a.click();
  
    // Clean up
    window.URL.revokeObjectURL(url);
  }
  
  convertToCSV(users: any[]): string {
    const headers = ['ID', 'First Name', 'Last Name', 'Gender', 'Email'];
    const rows = users.map(user => [
      user.id,
      user.firstname,
      user.lastname,
      user.gender,
      user.email
    ]);
  
    // Join headers and rows with commas and line breaks
    const csvContent = [
      headers.join(','), // Header row
      ...rows.map(row => row.join(',')) // Data rows
    ].join('\n');
  
    return csvContent;
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
      console.log("Subscription Ended");
    }
    if(this.getLoggedInUserSubscription){
      this.getLoggedInUserSubscription.unsubscribe();
      console.log("getLoggedInUser Subscription Ended");
    }
    if(this.getUsersSubscription){
      this.getUsersSubscription.unsubscribe();
      console.log("getUsers Subscription Ended");
    }
    if(this.deleteUserSubscription){
      this.deleteUserSubscription.unsubscribe();
      console.log("Delete User Subscription Ended");
    }
  }
  
}
