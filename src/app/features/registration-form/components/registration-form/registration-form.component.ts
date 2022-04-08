import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { validatePasswordInput } from 'src/app/shared/validators/password-validator';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {

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

/*     gender: new FormControl("", [
          Validators.required
        ]), */

  constructor() { }

  ngOnInit(): void {
  }

  async register() {
    // TODO: validate the reCaptcha token that the challenge gave to the user
    //       and if successful then make the registration request otherwise show UI feedback and reset the reCaptcha challenge
  }
}
