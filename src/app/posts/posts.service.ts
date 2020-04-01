import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators';
@Injectable({providedIn:"root"})

export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpclient: HttpClient) {}

  getPosts() {
    this.httpclient
      .get<{ message: string; posts: any }>(
        "http://localhost:3000/api/posts"
      )
      //fixing _id issue
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title : post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe(Fixedpost => {
        this.posts = Fixedpost;
        this.postsUpdated.next([...this.posts]);
      });
  }
//returns an object which we can listen but cannot emmit
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.httpclient
      .post<{ postId : string, message: string }>("http://localhost:3000/api/posts", post)
      .subscribe(responseData => {
        const id = responseData.postId;  // overwrting the null id to the id made when entered to the db to prevent a 'null' being passed in url
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

//Delete posts method
deletePost(postId: string) {
  this.httpclient.delete("http://localhost:3000/api/posts/" + postId).subscribe(() => {
    const updatePostView = this.posts.filter(post => post.id !== postId); //Keep entries where claus is not equal, delete where it is equal.
    this.posts = updatePostView;
    this.postsUpdated.next([...this.posts])
  });
}
}
