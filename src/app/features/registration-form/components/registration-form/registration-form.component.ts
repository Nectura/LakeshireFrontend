import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecaptchaComponent } from 'ng-recaptcha';
import { lastValueFrom } from 'rxjs';
import { REGISTRATION_ENDPOINT } from 'src/app/constants/auth-endpoints';
import { AuthService } from 'src/app/core/services/auth.service';
import { validatePasswordInput } from 'src/app/shared/validators/password-validator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {

  @ViewChild('reCaptcha') reCaptcha?: RecaptchaComponent;

  readonly registrationFormGroup = new FormGroup({
    firstName: new FormControl("", [
      Validators.required
    ]),
    lastName: new FormControl("", [
      Validators.required
    ]),
    emailAddress: new FormControl("", [
      Validators.required,
      Validators.email]),
    password: new FormControl("", {
      validators: [
        Validators.required,
        Validators.minLength(8),
        validatePasswordInput
      ],
      updateOn: 'change'
    }),
    reCaptchaToken: new FormControl(null, Validators.required)
  });

  constructor(
    private readonly httpClient: HttpClient,
    private readonly router: Router) { }

  ngOnInit(): void {
  }

  async register() {
    try {
      // TODO: validate the reCaptcha token that the challenge gave to the user
      //       and if successful then make the registration request otherwise show UI feedback and reset the reCaptcha challenge
      await lastValueFrom(this.httpClient.post(environment.authServer + REGISTRATION_ENDPOINT, {
        firstName: this.registrationFormGroup.value.firstName,
        lastName: this.registrationFormGroup.value.lastName,
        emailAddress: this.registrationFormGroup.value.emailAddress,
        password: this.registrationFormGroup.value.password,
        gender: 0
      }));
      alert("Registered!");
      this.router.navigate(['/login']);
    } catch (ex) {
      const errorResponse = ex as HttpErrorResponse;
      switch (errorResponse.status) {
        case HttpStatusCode.BadRequest:
          alert("The request is malformed.");
          break;
        case HttpStatusCode.Conflict:
          alert("The email address is taken.");
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
