import { HttpInterceptor,HttpRequest,HttpHandler } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserAuthService } from "./userauth.service";

@Injectable() //required to inject a service into a service
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: UserAuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken(); //retrieve token from service
    const authRequest = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + authToken)
    });
    return next.handle(authRequest);
  }
}
