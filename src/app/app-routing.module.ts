import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { HomePageComponent } from './features/home-page/home-page.component';
import { LoginFormComponent } from './features/login-form/components/login-form/login-form.component';
import { RegistrationFormComponent } from './features/registration-form/components/registration-form/registration-form.component';

const routes: Routes = [
  { path: 'login', component: LoginFormComponent },
  { path: 'register', component: RegistrationFormComponent },
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] },
  
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
