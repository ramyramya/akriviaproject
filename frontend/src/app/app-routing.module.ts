import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path:'login',
  loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {path:'signup',component:SignupComponent},
  {path:'',redirectTo:'/signup',pathMatch:'full'},
  {path: 'home', component: HomeComponent},
  {path: '**', redirectTo: '/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
