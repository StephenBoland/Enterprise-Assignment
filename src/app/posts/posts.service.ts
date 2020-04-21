//this file is responsible for handling the logic behind post actions.
import { Post } from "./post.model";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { Subject } from "rxjs";


@Injectable({ providedIn: "root" })

export class PostManage {
  private posts: Post[] = [];
  private p_Updated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient, private router: Router) {}
//get all posts
  getPosts() {
    this.httpClient
      .get<{ message: string; posts: any }>
      ("http://localhost:3000/api/posts")
      //fixing _id db issue
      .pipe(map(postContent => {
          return postContent.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imgPath: post.imgPath,
              creator: post.creator
            };
          });
        })
      )
      .subscribe(fixedPost => {
        this.posts = fixedPost;
        this.p_Updated.next([...this.posts]);
      });
  }

  postUpdateListener() {
    return this.p_Updated.asObservable();
  }
//get single post
  retrievePost(id: string) {
    return this.httpClient.get<{
       _id: string;
        title: string;
        content: string;
        imgPath: string;
      creator:string;
     }>( //expect the args + image path from db
      "http://localhost:3000/api/posts/" + id );
  }
//adding a post
  p_add(title: string, content: string, image: File, creator:string) {
    const postContent = new FormData(); //form data lets combination of text and file values
    postContent.append("title", title);
    postContent.append("content", content);
    postContent.append("image", image, title);
    this.httpClient
      .post<{ message: string; post: Post }>(
        "http://localhost:3000/api/posts",
        postContent
      )
      .subscribe(responseData => {
        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imgPath: responseData.post.imgPath,
          creator: responseData.post.creator
        };
        this.posts.push(post);
        this.p_Updated.next([...this.posts]);
        this.router.navigate(["/postlist"]);
      });
  }
//executed upon saving an edit
  updatePost(id: string, title: string, content: string, image: File | string) { //passing in the contents expected from update
    let postContent: Post | FormData; //post content will always exist
    if (typeof image === "object") { //checking for image type
      postContent = new FormData(); //Need this for uploading new image.
      postContent.append("id", id); //append ID or server will try generate a new one and break
      postContent.append("title", title);
      postContent.append("content", content);
      postContent.append("image", image, title);
    } else {
      postContent = { //save the form with new content
        id: id,
        title: title,
        content: content,
        imgPath: image,
        creator:null
      };
    }
    this.httpClient
      .put("http://localhost:3000/api/posts/" + id, postContent)
      .subscribe(response => {
        //moved this logic up
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        // const post: Post = { //save the form with new content
        //   id: id,
        //   title: title,
        //   content: content,
        //   imgPath: "" //getting img path back from mongo
        // };
        // updatedPosts[oldPostIndex] = post;
        // this.posts = updatedPosts;
        // this.p_Updated.next([...this.posts]);
        this.router.navigate(["/"]);//re-routing the user
      });
  }
//deleting a post
  deletePost(postId: string) {
   return this.httpClient
      .delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);//Keep entries where claus is not equal, delete where it is equal.S
        this.posts = updatedPosts;
        this.p_Updated.next([...this.posts]);
      });
  }
}
