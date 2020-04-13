import { Component, OnInit, OnDestroy } from "@angular/core";
import { UserAuthService } from "../userauth/userauth.service";
import { Subscription } from "rxjs";
import { AuthInterceptor } from "../userauth/auth-interceptor";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userAuthenticated = false; //default authentication is false
  private AuthListenerSubscription : Subscription;
  constructor(private UserAuthService: UserAuthService ) {}

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

