import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { PostManage } from "../posts.service";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator"; //attaching the img validator

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
    public PostManage: PostManage,
    public route: ActivatedRoute
  ) {}

  ngOnInit() { //form
    this.form = new FormGroup({ //initializing the form
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {validators: [Validators.required],asyncValidators: [mimeType]})
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.loading = true;
        this.PostManage.retrievePost(this.postId).subscribe(postData => {
          this.loading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imgPath: postData.imgPath,
            creator:postData.creator
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imgPath
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  imageSelect(event: Event) { //image selecting
    const file = (event.target as HTMLInputElement).files[0]; //a html input as a file
    this.form.patchValue({ image: file }); // patch value allows targetting of a single control, AKA image
    this.form.get("image").updateValueAndValidity();// validation
    const reader = new FileReader();
    reader.onload = () => { //function is executed upon finishing the loading of a resource
      this.imgPrev
   = reader.result as string;
    };
    reader.readAsDataURL(file); //load the file
  }

  savePost() {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    if (this.mode === "create") {
      this.PostManage.p_add(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image,
        this.form.value.creator
      );
    } else {
      this.PostManage.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }
}
