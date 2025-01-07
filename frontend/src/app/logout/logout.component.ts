import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login/services/login.service';
interface Message{
  success: boolean,
  message: string
}
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoutComponent implements OnInit {

  message !: Message;
  constructor(private route: Router, private http: HttpClient, private loginService: LoginService) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    console.log(token);
    if(token){
      localStorage.removeItem('token');
      this.message = {success: true, message: 'Logged out successfully'};
      this.loginService.isLoggedIn = false;
      alert('Logged out successfully');
      this.route.navigateByUrl('/login');
    }
    else{
      this.message = {success: false, message: 'No session found'};
      alert('No session found');
      this.route.navigateByUrl('/login');
    }
    
  }

}
