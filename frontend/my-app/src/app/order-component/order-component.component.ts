import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CartItem } from '../products/cartitemmodel';
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { Productservice } from '../products/product-service';
import { AuthService } from "../auth/auth.servise";
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-order-component',
  templateUrl: './order-component.component.html',
  styleUrls: ['./order-component.component.css']
})
export class OrderComponentComponent implements OnInit {
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
       this.userIsAuthenticated = this.authService.getIsAuth();
       this.authStatusSub = this.authService
         .getAuthStatusListener()
         .subscribe(isAuthenticated => {
           this.userIsAuthenticated = isAuthenticated;
         });

        //  form
        this.form = new FormGroup({
          city: new FormControl(null, { validators: [Validators.required] }), 
          street: new FormControl(null, { validators: [Validators.required] }),
          date: new FormControl(null, { validators: [Validators.required] }),
            // const name = req.body.name;
      // const category = req.body.category;
      // const price = req.body.price;
      // const imagePath=url+"/images/"+req.file.filename;
    
        });
  }

}
