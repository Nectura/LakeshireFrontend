import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecaptchaComponent } from 'ng-recaptcha';
import { lastValueFrom } from 'rxjs';
import { LOGIN_ENDPOINT } from 'src/app/constants/auth-endpoints';
import { AuthService } from 'src/app/core/services/auth.service';
import { JwtTokenResponse } from 'src/app/features/login-form/models/JwtTokenResponse';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  @ViewChild('reCaptcha') reCaptcha?: RecaptchaComponent;

  readonly loginFormGroup = new FormGroup({
    emailAddress: new FormControl("", [
      Validators.required,
      Validators.email]),
    password: new FormControl("", [
      Validators.required
    ]),
    persistentLogin: new FormControl(false, [
      Validators.required
    ]),
    reCaptchaToken: new FormControl(null, Validators.required)
  });
  
  constructor(
    private readonly httpClient: HttpClient,
    private readonly authService: AuthService,
    private readonly router: Router) { }

  ngOnInit(): void {
  }

  async login() {
    try {
      // TODO: validate the reCaptcha token that the challenge gave to the user
      //       and if successful then make the login request otherwise show UI feedback and reset the reCaptcha challenge
      const response = await lastValueFrom(this.httpClient.post<JwtTokenResponse>(environment.authServer + LOGIN_ENDPOINT, {
        emailAddress: this.loginFormGroup.value.emailAddress,
        password: this.loginFormGroup.value.password
      }));
      this.authService.updateToken(response.accessToken, response.refreshToken, this.loginFormGroup.value.persistentLogin);
      this.router.navigate(['/']);
    } catch (ex) {
      const errorResponse = ex as HttpErrorResponse;
      switch (errorResponse.status) {
        case HttpStatusCode.BadRequest:
          alert("The Email Address or Password are malformed.");
          break;
        case HttpStatusCode.Unauthorized:
          alert("Incorrect Email Address or Password.");
          break;
        default:
          alert("Unhandled error received. Logged in console.");
          console.error(ex);
          break;
      }
      //this.loginFormGroup.controls['password'].reset();
    } finally {
      this.reCaptcha?.reset();
    }
  }
}


