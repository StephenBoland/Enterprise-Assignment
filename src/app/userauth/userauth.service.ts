import { Injectable } from "@angular/core";
import { UserAuthData } from "./auth.model";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root"})
export class UserAuthService {
  private token: string;



  constructor(private HttpClient:HttpClient) {}

  getToken() {
    return this.token;
  }
//registering a user
  userCreate(email:string, password:string ){
    const AuthData: UserAuthData = {email:email, password:password};
    this.HttpClient.post("http://localhost:3000/api/user/register",AuthData)
    .subscribe(Response => {
      console.log(Response);
    });

  }
//logging in user
  login(email:string, password:string) {
    const AuthData: UserAuthData = {email:email, password:password};
    this.HttpClient.post<{token}>("http://localhost:3000/api/user/login", AuthData)
    .subscribe(response => {
      const token = response.token;
      this.token = token; //storing the token
    });
  }

}
