import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, RequiredValidator } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";
import { imgType } from "./img-validator"; //attaching the img validator
@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  post: Post;
  loading = false;
  form: FormGroup;
  private mode = "create";
  private postId: string;
  imgPrev: string;
  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() { //form
    this.form = new FormGroup({ //init the form
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(5)]}), //null if creating post
      content: new FormControl(null, {validators:[Validators.required, Validators.minLength(5)]}), //using validators to make form input required
      image: new FormControl(null, {validators: [Validators.required], asyncValidators:[imgType]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "editpost";
        this.postId = paramMap.get("postId");
        //show loading symbol
        this.loading = true;

        this.postsService.retrievePost(this.postId).subscribe(postData => {
          //hide loading symbol
          this.loading = false;

          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content
          };
        this.form.setValue({
          title: this.post.title,
          content: this.post.content
        });
      });
        } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  imageSelect(event: Event) //image selecting
{
  const chosenfile = (event.target as HTMLInputElement).files[0]; //a html element input as a file
  this.form.patchValue({image: chosenfile}); //patch value allows you to target a single control (image)
  this.form.get('image').updateValueAndValidity(); //validate
  const reader = new FileReader();
  reader.onload = () => { //function executed when it's done loading a resource
    this.imgPrev = reader.result as string;
  };
  reader.readAsDataURL(chosenfile); //load the file
}

  onSave() {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    if (this.mode === "create") {
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value);
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content
      );
    }
    this.form.reset();
  }
}
