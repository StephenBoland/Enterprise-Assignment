import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { UserAuthService } from "../userauth.service";

@Component({
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent {
  loading = false;

  constructor(public authService: UserAuthService) {}
//getting user input from login form
  userLogin(form: NgForm) {
    if (form.invalid) { //check if the form is valid
      return;
    }
    this.authService.login(form.value.email, form.value.password);
  }
}
