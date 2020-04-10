import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { LoginComponent } from "./userauth/login/login.component";
import { RegisterComponent } from "./userauth/register/register.component";

const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'createpost', component: PostCreateComponent }, //create post page
  { path: 'editpost/:postId', component: PostCreateComponent }, //edit post page
  { path: 'login', component: LoginComponent }, //login page
  { path: 'register', component: RegisterComponent } //Register Page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
