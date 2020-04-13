import { Component, OnInit } from '@angular/core';
import { UserAuthService } from './userauth/userauth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private UserAuthService: UserAuthService) {} //implemennt automatic user authentication checks
  ngOnInit() {
    this.UserAuthService.AutomaticAuthentication();
  }

}
