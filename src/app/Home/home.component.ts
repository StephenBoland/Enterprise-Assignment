import { Component } from "@angular/core";
import { Subscription } from "rxjs";
import { UserAuthService } from "../userauth/userauth.service";

@Component({
  selector: 'app-home',
  templateUrl: '/home.component.html',
  styleUrls: ['/home.component.css']

})
export  class HomeComponent {
  userAuthenticated = false; //default authentication is false
  private AuthListenerSubscription : Subscription;
  constructor(private UserAuthService: UserAuthService) {}

  ngOnInit () {
    this.userAuthenticated = this.UserAuthService.UserAuthenticated(); //refreshing authentication
    this.AuthListenerSubscription = this.UserAuthService.getAuthenticationStatus().subscribe(Authenticated => { //changing the user to being authenticated
    this.userAuthenticated = Authenticated;
    });
  }
//logging out
  userLogout() {
    this.UserAuthService.logout();

  }

  ngOnDestroy () {
    this.AuthListenerSubscription.unsubscribe();

  }
}
