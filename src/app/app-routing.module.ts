import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { LoginComponent } from "./userauth/login/login.component";
import { RegisterComponent } from "./userauth/register/register.component";
import { AuthenticationGaurd } from "./userauth/auth.gaurd";
const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'createpost', component: PostCreateComponent, canActivate:[AuthenticationGaurd] }, //create post page, Guarded
  { path: 'editpost/:postId', component: PostCreateComponent, canActivate:[AuthenticationGaurd] }, //edit post page, Gaurded
  { path: 'login', component: LoginComponent }, //login page
  { path: 'register', component: RegisterComponent } //Register Page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthenticationGaurd]
})
export class AppRoutingModule {}
