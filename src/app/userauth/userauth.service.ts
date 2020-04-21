import { Injectable } from "@angular/core";
import { UserAuthData } from "./auth.model";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root"})
export class UserAuthService {
  private AuthenticationStatus = new Subject<boolean>(); // is the user authenticated true or false
  private token: string;
  private userId : string;
  private Authenticated = false;
  private tokenTime : any; // to keep track of token time


  constructor(private HttpClient:HttpClient, private app:Router) {}
  //checking if user is authenticated
  getAuthenticationStatus() {
    return this.AuthenticationStatus.asObservable();
  }
  UserAuthenticated() {
    return this.Authenticated;
  }
//getting the user's id
  getUserId() {
    return this.userId;
  }
//getting the user's auth token
  getToken() {
    return this.token;
  }

//registering a user
  userCreate(email:string, password:string ){
    const AuthData: UserAuthData = {email:email, password:password};
    this.HttpClient.post("http://localhost:3000/api/user/register",AuthData)
    .subscribe(Response => {
      console.log(Response);
      this.login(AuthData.email, AuthData.password);
      this.app.navigate(['home']);//redirect after register
    });
  }

//loging in the user
login(email: string, password: string) {
  const authData: UserAuthData = {email: email, password: password};
  this.HttpClient.post<{token: string, tokenExpiresIn: number, userId:string }>("http://localhost:3000/api/user/login", authData)
    .subscribe(response => {
      const token = response.token;
      this.token = token; //store the token
      console.log(response);
      if (token) {
        const tokenExpirationDuration = response.tokenExpiresIn; //Communicating when token will end -> require logout
        this.AuthenticationTimer(tokenExpirationDuration); //Tracking authentication timer
        this.Authenticated= true; //if token is present, authenticate the user
        this.userId = response.userId;
        this.AuthenticationStatus.next(true);
        const currentdate = new Date(); //getting the current time
        const ExpDate = new Date(currentdate.getTime() + tokenExpirationDuration * 1000); //getting expire date
        this.saveTokenData(token,ExpDate, this.userId);

        this.app.navigate(['/']);//redirect after login
      }
    });
}
//automatically authenticate the user if the data exists
AutomaticAuthentication() {
  const AuthenticationInformation = this.AuthenticationData();
  if (!AuthenticationInformation) { //if no stored information, return nothing
    return;
  }
  //check if exp date is in the future
  const currentdate = new Date();
  const tokenExpiresIn = AuthenticationInformation.ExpDate.getTime() - currentdate.getTime(); //deducting current time from future time(if it exists, may return negative)
  console.log(AuthenticationInformation, tokenExpiresIn);
  if (tokenExpiresIn > 0) { //if token in future, authenticate the user
    this.token = AuthenticationInformation.token;
    this.Authenticated = true;
    this.userId = AuthenticationInformation.userId; //fetch userid from local storage
    this.AuthenticationTimer(tokenExpiresIn / 1000); //Tracking authentication timer, divide by 1000 because value is in miliseconds
    this.AuthenticationStatus.next(true);
  }
}

//logging the user out, deleting token and changing session back to false.
logout(){
  this.token = null;
  this.Authenticated = false;
  this.AuthenticationStatus.next(false);
  clearTimeout(this.tokenTime); //clearing the token timer upon logout
  this.clearTokenData(); //clear local storage
  this.userId = null;
  this.app.navigate(['/']); //redirect after logout

}

//storing data after page reload
private saveTokenData(token: string, ExpDate: Date, userId:string) {
  localStorage.setItem('token', token);
  localStorage.setItem('exp', ExpDate.toISOString()); //storing data to local storage
  localStorage.setItem('userId', userId);
}
//removing data from local storage
private clearTokenData() {
  localStorage.removeItem('token');
  localStorage.removeItem('exp');
  localStorage.removeItem('userId');
}
//getting authentication data for automatic authentication
private AuthenticationData(){
  const token = localStorage.getItem('token');
  const ExpDate = localStorage.getItem('exp');
  const userId = localStorage.getItem('userId');
  if (!token || !ExpDate) { //if token or date doesnt exist, return nothing
    return;
  }
  return { //if token and exp date exist, return token and exp date
    token: token,
    ExpDate: new Date(ExpDate),
    userId: userId
    }
  }
//Authentication timer duration
  private AuthenticationTimer (duration:number){
    console.log("timer"+ duration);
    this.tokenTime = setTimeout(() => {
      this.logout();
    }, duration * 1000); //time is returned in seconds, so multiply by 1000
  }
}
