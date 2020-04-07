import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({providedIn:"root"})

export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpclient: HttpClient, private router: Router) {}

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
            id: post._id,
            imgPath: post.imgPath
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

  retrievePost(id: string)
  {
    return this.httpclient.get<{_id: string, title:string, content:string }>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string, image: File) {
    const postContent = new FormData(); //form data lets combination of text and file values
    postContent.append("title", title);
    postContent.append("content", content);
    postContent.append("image", image, title); //pass img + title of the img
    this.httpclient
      .post<{ message: string, post: Post }> ("http://localhost:3000/api/posts", postContent)
      .subscribe(responseData => {
        const post: Post = { id: responseData.post.id, title: title, content: content, imgPath: responseData.post.imgPath}; //create post
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]); //re-routing the user
      });
  }


  updatePost(id: string, title:string, content:string )
  {
    const post: Post = {
      id: id, title:title, content:content, imgPath: null
    };
    this.httpclient.put('http://localhost:3000/api/posts/' + id, post).subscribe(
      response => {
        const updatePosts = [...this.posts];
        const oldPost = updatePosts.findIndex(x => x.id === post.id);
        updatePosts[oldPost] = post;
        this.posts = updatePosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]); //re-routing the user

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
