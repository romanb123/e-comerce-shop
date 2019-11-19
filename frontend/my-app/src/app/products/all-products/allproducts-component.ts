import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../productmodel';
import { CartItem } from '../cartitemmodel';
import { Productservice } from '../product-service';
import { AuthService } from "../../auth/auth.servise";
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { Subscription } from 'rxjs';
@Component({
  selector: 'allproducts',
  templateUrl: './allproducts.html',
})
export class Allproductscomponent implements OnInit, OnDestroy {
  products: Product[] = [];
  cartitems: CartItem[] = [];
  private productsub: Subscription;
  private cartitemsub: Subscription;
  loading = false;
  form: FormGroup;
  userIsAuthenticated = false;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  productservice: Productservice;
  constructor(productservice: Productservice,private authService: AuthService) {
    this.productservice = productservice;
  }
  ngOnInit() {
    this.loading = true;
     // ===========get cart data=========================
     this.productservice.getcartitems();
     this.cartitemsub = this.productservice.cartitemsUpdatelistener()
       .subscribe((Cartitem: CartItem[]) => {
         this.loading = false;
         this.cartitems = Cartitem;
         console.log(this.cartitems);
       });
    // ===========get products data=========================
    this.productservice.getproduct();
    this.productsub = this.productservice.productUpdatelistener()
      .subscribe((Product: Product[]) => {
        this.loading = false;
        this.products = Product;
        console.log(this.products);
      });
        // ===========get authenticated  data=========================
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
        });
         // ===========get cart  data=========================
         this.form = new FormGroup({
          search: new FormControl(null, { validators: [Validators.required] }),
          category: new FormControl(null, { validators: [Validators.required] }), 
        });
  }
  onSearchProduct(){
    const search= this.form.value.search;
    this.productservice.searchproduct(search);
  }

  backtoallproducts(){
    this.productservice.getproduct();
    this.productsub = this.productservice.productUpdatelistener()
      .subscribe((Product: Product[]) => {
        this.loading = false;
        this.products = Product;
        console.log(this.products);
      });
  }
  
  onCategoryProduct(){
    const category= this.form.value.category;
    console.log(category);
    this.productservice.categoryproduct(category);
  }


  onAddToCart(id:string){
this.productservice.addtocart(id);
  }
  onDeleteFromCart(id:string){
    this.productservice.deletefromcart(id);
      }
      onClearCart(id:string){
        this.productservice.clearcart();
          }
  ngOnDestroy() {
    this.productsub.unsubscribe();
  }
}