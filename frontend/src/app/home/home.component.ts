import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from './services/home.service';

interface User {
  id: number;
  firstname: string;
  lastname: string;
  dob: string;
  gender: string;
  email: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: User = {
    id: 0,
    firstname: '',
    lastname: '',
    dob: '',
    gender: '',
    email: '',
  };
  users: User[] = [];
  loggedInUserId: number | null = null;
  displayedColumns: string[] = ['id', 'firstname', 'lastname', 'gender', 'email', 'actions'];

  constructor(private route: Router, private homeService: HomeService) { }

  ngOnInit(): void {
    this.getLoggedInUser();
    this.getUsers();
  }

  getLoggedInUser(): void {
    this.homeService.getLoggedInUser().subscribe({
      next: response => {
        if (response.success) {
          this.user = response.userData;
          console.log(this.user);
          this.loggedInUserId = response.userData.id;
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
    this.homeService.getUsers().subscribe({
      next: response => {
        if (response.success) {
          this.users = response.users;
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
  

  deleteUser(userId: number): void {
    this.homeService.deleteUser(userId).subscribe({
      next: response => {
        alert(response.message);
        if(response.message){
          this.route.navigateByUrl('/logout');
        }
      },
      error: error => {
        alert('An error occurred while deleting the user');
      }
    });
  }
}
