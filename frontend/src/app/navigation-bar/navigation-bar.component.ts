import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private router: Router) {}


  onLogout() {
    // Perform logout logic here, e.g., clearing user session
    const token = localStorage.getItem('token');
    if (token) {
      localStorage.removeItem('token');
      alert('Logged out successfully');
    }
    else {
      alert('You are not logged in');
    }
    this.router.navigate(['/login']);
  }

}
