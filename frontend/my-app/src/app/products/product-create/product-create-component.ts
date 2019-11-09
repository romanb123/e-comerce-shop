import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { Productservice } from '../product-service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Product } from '../productmodel';
import {typecheck} from './imagetype-check';


@Component({
  selector: 'product-create-component',
  templateUrl: './product-create-component.html',
  styleUrls: ['./product-create-component.css']
})
export class ProductCreateComponent {
  private mode = 'create';
  private postid: string = null;
  product: Product;
  loading = false;
  form: FormGroup;
  previmage: string;
  // id: string,title: string,price: string, description: string, image: File,category: string,userId:string

  
  constructor(public productservice: Productservice, public route: ActivatedRoute) { }
  ngOnInit() {
    this.form = new FormGroup({
      id: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      title: new FormControl(null, { validators: [Validators.required] }),
      price: new FormControl(null, { validators: [Validators.required] }),
      description: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required],asyncValidators:[typecheck] }),
      category: new FormControl(null, { validators: [Validators.required] }),
      userid: new FormControl(null, { validators: [Validators.required] }),
      

    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      // if (paramMap.has('postid')) {
      //   this.mode = 'edit';
      //   this.postid = paramMap.get('postid');
      //   this.loading = true;
      //   this.postservice.gesingle(this.postid).subscribe(post => {
      //     this.loading = false;
      //     this.product = { id: post._id, title: post.title, body: post.body,imagePath: post.imagePath };
      //     this.form.setValue({ title: this.product.title, body: this.product.body, image:this.product.imagePath });

      //   });
      // } else {
        this.mode = 'create';
        this.postid = null;
     
    });
  }


  onAddPproduct() {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    if (this.mode === "create") {
      this.productservice.addproduct(
        this.form.value.id,
        this.form.value.title,
        this.form.value.price,
        this.form.value.description,
        this.form.value.image,
        this.form.value.category,
        this.form.value.userid,
       
         );
    }
    //  else {
    //   this.postservice.updatepost(this.postid, this.form.value.title, this.form.value.body,this.form.value.image);
    // }
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