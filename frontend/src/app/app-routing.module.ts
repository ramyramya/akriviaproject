import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { LogoutComponent } from './logout/logout.component';
import { LoginGuard } from './guards/login.guard';
import { SignupGuard } from './signup/guards/signup.guard';
import { UserViewComponent } from './home/user-view/user-view.component';


const routes: Routes = [
  {path:'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
    canActivate:[SignupGuard]
  },
  {path:'signup',component:SignupComponent, canActivate:[SignupGuard]},
  {path:'edit-user',component:SignupComponent},
  {path: 'home/:id',component: UserViewComponent, pathMatch: 'full', canActivate: [LoginGuard]},
  {path:'home',component:HomeComponent, canActivate:[LoginGuard]},
  {path:'logout',component:LogoutComponent, canActivate:[LoginGuard]},
  {path:'',redirectTo:'/signup',pathMatch:'full'},
  {path:'**',redirectTo:'/login',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
