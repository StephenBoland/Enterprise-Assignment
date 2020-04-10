import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { UserAuthService } from "../userauth.service";

@Component({

  templateUrl: '/login.component.html',
  styleUrls: ['/login.component.css']

 })
export class LoginComponent {
  loading = false;
//taking the user input from login form

constructor(public userauthservice: UserAuthService ) {}

  login(form: NgForm)
{
  if (form.invalid) { //check if form is valid
    return;
  }
  this.userauthservice.login(form.value.email, form.value.password);
  }
}
