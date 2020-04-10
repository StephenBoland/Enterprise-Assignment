import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { UserAuthService } from "../userauth.service"
@Component({

  templateUrl: '/register.component.html',
  styleUrls: ['/register.component.css']

 })
export class RegisterComponent {
  loading = false;

  constructor(public userauthservice:UserAuthService){}
//taking the user input from register form
  userRegister(form: NgForm)
  {
    if (form.invalid)
    {
      return;
    }
  this.userauthservice.userCreate(form.value.email, form.value.password);
  }
}
