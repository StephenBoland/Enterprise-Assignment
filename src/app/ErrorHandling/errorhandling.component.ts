import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";

@Component({
  templateUrl:'./errorhandling.component.html'
})
export class ErrorHandlingComponent{
  constructor(@Inject(MAT_DIALOG_DATA) public msg: {errormessage: string}) {}
  //displaying the error message
}
