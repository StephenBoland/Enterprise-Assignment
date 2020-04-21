
import { HttpInterceptor,HttpRequest,HttpHandler,HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { MatDialog } from "@angular/material";
import { ErrorHandlingComponent } from "./app/ErrorHandling/errorhandling.component";

//Handling error messages
@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  	constructor(private errormessage:MatDialog){}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) =>
      {
        //forming the error mesasge
        let errorMessage = "Email Address Invalid, or Incorrect Password";
        if(error.error.errormessage){
          errorMessage = error.error.errormessage;
        }
        this.errormessage.open(ErrorHandlingComponent,{data: {errormessage:errorMessage}});
        return throwError(error);
      })
      );
  }
}
