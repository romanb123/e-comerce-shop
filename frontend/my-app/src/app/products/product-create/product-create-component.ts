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
  private productid: string = null;
  product: Product;
  loading = false;
  form: FormGroup;
  previmage: string;
  // id: string,title: string,price: string, description: string, image: File,category: string,userId:string

  
  constructor(public productservice: Productservice, public route: ActivatedRoute) { }
  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required] }), 
      category: new FormControl(null, { validators: [Validators.required] }),
       price: new FormControl(null, { validators: [Validators.required] }),
       image: new FormControl(null, { validators: [Validators.required],asyncValidators:[typecheck] }),
        // const name = req.body.name;
  // const category = req.body.category;
  // const price = req.body.price;
  // const imagePath=url+"/images/"+req.file.filename;

    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('productid')) {
        this.mode = 'edit';
        this.productid = paramMap.get('productid');
        this.loading = true;
        console.log(this.productid);
        this.productservice.gesingle(this.productid).subscribe(product => {
          this.loading = false;
          this.product = { id: product.id, name: product.name,price:product.price, category: product.category,image: product.image };
          this.form.setValue({ name: this.product.name, category: this.product.category,
            price: this.product.price, image:this.product.image });

        });
      } else {
        this.mode = 'create';
        this.productid = null;
      }
     
    });
  }
 
  // const name = req.body.name;
  // const category = req.body.category;
  // const price = req.body.price;
  // const imagePath=url+"/images/"+req.file.filename;

  onAddPproduct() {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    if (this.mode === "create") {
      this.productservice.addproduct(
        this.form.value.name,
        this.form.value.category,
        this.form.value.price,
        this.form.value.image, 
         );
    }
     else {
      this.productservice.updateproduct(this.productid,this.form.value.name,
        this.form.value.price,
        this.form.value.category,
        this.form.value.image);
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