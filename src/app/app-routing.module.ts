import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";

const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'createpost', component: PostCreateComponent }, //create post page
  { path: 'editpost/:postId', component: PostCreateComponent }, //edit post page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
