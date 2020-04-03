import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';


const routes: Routes = [
  { path: '', component: PostListComponent }, //empty means home page
  { path: 'createpost', component:PostCreateComponent },
  { path: 'editpost/:postId', component:PostCreateComponent } //dynamic post ID so we know what post to edit
];

//letting angular know about the routes
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
