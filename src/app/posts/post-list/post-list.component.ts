import { Component, OnInit, OnDestroy } from "@angular/core";
import { Post } from "../post.model";
import { PostManage } from "../posts.service";
import { Subscription } from 'rxjs';
import { UserAuthService } from "src/app/userauth/userauth.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})

export class PostListComponent implements OnInit, OnDestroy {
  private AuthListenerSubscription : Subscription;
  posts: Post[] = [];
  loading = false;
  private postsSub: Subscription;
  userAuthenticated = false;
  userId: string;

  constructor(public PostManage: PostManage, private UserAuthService:UserAuthService) {}

  ngOnInit() { //oninit is used to handle additional initializiation
    this.loading = true; //Using to display/hide a spinner

    this.PostManage.getPosts();
    this.userId = this.UserAuthService.getUserId();
    this.postsSub = this.PostManage.postUpdateListener()
      .subscribe((posts: Post[]) => {
        this.loading = false;
        this.posts = posts;
      });
      this.userAuthenticated = this.UserAuthService.UserAuthenticated(); //refreshing authentication
      //authentication check
      this.AuthListenerSubscription = this.UserAuthService.getAuthenticationStatus().subscribe(Authenticated => {
        this.userAuthenticated = Authenticated;
        this.userId = this.UserAuthService.getUserId();

      });

  }
//deleting a post
  onDelete(postId: string) {
    this.PostManage.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.AuthListenerSubscription.unsubscribe();
  }
}
