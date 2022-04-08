import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { LOGIN_ENDPOINT } from 'src/app/constants/endpoints';
import { JwtTokenResponse } from 'src/app/core/models/JwtTokenResponse';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  readonly loginFormGroup = new FormGroup({
    emailAddress: new FormControl("", [
      Validators.required,
      Validators.email]),
    password: new FormControl("", [
      Validators.required
    ])
  });

  constructor(private readonly httpClient: HttpClient) { }

  ngOnInit(): void {
  }

  async login() {
    try {
      const response = await lastValueFrom(this.httpClient.post<JwtTokenResponse>(environment.authServer + LOGIN_ENDPOINT, {
        emailAddress: this.loginFormGroup.value.emailAddress,
        password: this.loginFormGroup.value.password
      }));
      console.log(response);
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
    }
  }
}


