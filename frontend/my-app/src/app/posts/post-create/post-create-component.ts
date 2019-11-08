import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { Postservice } from '../post-service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../postmodel';
import {typecheck} from './imagetype-check';


@Component({
  selector: 'post-create-component',
  templateUrl: './post.create.component.html',
  styleUrls: ['./post-create-component.css']
})
export class PostCreateComponent {
  private mode = 'create';
  private postid: string = null;
  post: Post;
  loading = false;
  form: FormGroup;
  previmage: string;

  constructor(public postservice: Postservice, public route: ActivatedRoute) { }
  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      body: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required],asyncValidators:[typecheck] })

    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postid')) {
        this.mode = 'edit';
        this.postid = paramMap.get('postid');
        this.loading = true;
        this.postservice.gesingle(this.postid).subscribe(post => {
          this.loading = false;
          this.post = { id: post._id, title: post.title, body: post.body,imagePath: post.imagePath };
          this.form.setValue({ title: this.post.title, body: this.post.body, image:this.post.imagePath });

        });
      } else {
        this.mode = 'create';
        this.postid = null;
      }
    });
  }


  onAddPost() {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    if (this.mode === "create") {
      this.postservice.addpost(this.form.value.title, this.form.value.body,this.form.value.image);
    } else {
      this.postservice.updatepost(this.postid, this.form.value.title, this.form.value.body,this.form.value.image);
    }
    this.form.reset();
  };
  onfilepick(e: Event) {
    const file = (e.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    console.log(file);
    console.log(this.form);
    const reader=new FileReader();
    reader.onload=()=>{
      this.previmage=reader.result as string;
    };
    reader.readAsDataURL(file);
  }

}