import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts:Post[] = [];
  loading = false;
  private postsSub: Subscription;

  constructor(public postsService: PostsService) {}

  ngOnInit(){
    this.loading = true; //display spinner while doing action
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.loading = false; //hide spinner after action complete
      this.posts = posts;
    });
  }

  //ondelete method
  onDelete(postId: string) {
    this.postsService.deletePost(postId) //connecting delete post method
  }
//called when the component is about to get removed, prevents memory leak
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
