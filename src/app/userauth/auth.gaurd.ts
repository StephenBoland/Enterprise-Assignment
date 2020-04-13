// Angular route gaurds
// REF https://medium.com/@ryanchenkie_40935/angular-authentication-using-route-guards-bf7a4ca13ae3

import { CanActivate, Router } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { UserAuthService } from "./userauth.service";
@Injectable()
export class AuthenticationGaurd implements CanActivate {

  constructor(private UserAuthService: UserAuthService, private app:Router) {}

  canActivate(route: import("@angular/router").ActivatedRouteSnapshot,
   state: import("@angular/router").RouterStateSnapshot): boolean | import("@angular/router").UrlTree |
   import("rxjs").Observable<boolean | import("@angular/router").UrlTree>
   | Promise<boolean | import("@angular/router").UrlTree> {
     const Authenticated = this.UserAuthService.UserAuthenticated();
     if (!Authenticated) { //if not authenticated, navigate to login
      this.app.navigate(['/login'])
     }
    return Authenticated;
  }

}
