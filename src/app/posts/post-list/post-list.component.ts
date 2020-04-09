import { Component, OnInit, OnDestroy } from "@angular/core";
import { Post } from "../post.model";
import { PostManage } from "../posts.service";
import { Subscription } from 'rxjs';

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})

export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  loading = false;
  private postsSub: Subscription;

  constructor(public PostManage: PostManage) {}

  ngOnInit() {
    this.loading = true;
    this.PostManage.getPosts();
    this.postsSub = this.PostManage.postUpdateListener()
      .subscribe((posts: Post[]) => {
        this.loading = false;
        this.posts = posts;
      });
  }

  onDelete(postId: string) {
    this.PostManage.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
