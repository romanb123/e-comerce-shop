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
  private postsub: Subscription;
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
    this.productservice.getproduct;
    this.postsub = this.productservice.postUpdatelistener()
      .subscribe((Product: Product[]) => {
        this.loading = false;
        this.products = Product;
      });
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
        });
  }
//   onDelete(postid:string){
// this.productservice.deletepost(postid);
//   }
  ngOnDestroy() {
    this.postsub.unsubscribe();
  }
}