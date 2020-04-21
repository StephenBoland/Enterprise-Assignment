import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { HeaderComponent } from "./header/header.component";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { AppRoutingModule } from "./app-routing.module";
import { HomeComponent } from './Home/home.component';

import {
  MatInputModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatDialogModule,

} from "@angular/material";
import { LoginComponent } from "./userauth/login/login.component";
import { RegisterComponent } from "./userauth/register/register.component";
import { AuthInterceptor } from "./userauth/auth-interceptor";
import { ErrorHandlerInterceptor } from "src/errorhandling-interceptor";
import { ErrorHandlingComponent } from "./ErrorHandling/errorhandling.component";
// declare any new components here
@NgModule({
  declarations: [
    HomeComponent,
    AppComponent,
    HeaderComponent,
    PostCreateComponent,
    PostListComponent,
    LoginComponent,
    RegisterComponent,
    ErrorHandlingComponent
  ],
  imports: [
    MatIconModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatDialogModule,
  ],
  providers: [
   { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
   { provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents:[ErrorHandlingComponent]
})
export class AppModule {}
