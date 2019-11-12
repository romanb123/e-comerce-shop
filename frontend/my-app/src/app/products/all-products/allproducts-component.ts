import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../productmodel';
import { Productservice } from '../product-service';
import { AuthService } from "../../auth/auth.servise";

import { Subscription } from 'rxjs';
@Component({
  selector: 'allproducts',
  templateUrl: './allproducts.html',
})
export class Allproductscomponent implements OnInit, OnDestroy {
  products: Product[] = [];
  private productsub: Subscription;
  loading = false;
  userIsAuthenticated = false;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  productservice: Productservice;
  constructor(productservice: Productservice,private authService: AuthService) {
    this.productservice = productservice;
  }
  ngOnInit() {
    this.loading = true;
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
  }
//   onDelete(postid:string){
// this.productservice.deletepost(postid);
//   }
  ngOnDestroy() {
    this.productsub.unsubscribe();
  }
}