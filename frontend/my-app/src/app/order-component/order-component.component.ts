import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CartItem } from '../products/cartitemmodel';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { Productservice } from '../products/product-service';
import { OrderService } from './order-service.service';
import { AuthService } from "../auth/auth.servise";
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-order-component',
  templateUrl: './order-component.component.html',
  styleUrls: ['./order-component.component.css']
})
export class OrderComponentComponent implements OnInit {
  cartitems: CartItem[] = [];
  fileUrl;
  private productsub: Subscription;
  private cartitemsub: Subscription;
  loading = false;
  form: FormGroup;
  userIsAuthenticated = false;
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  productservice: Productservice;
  constructor(productservice: Productservice,private authService: AuthService,private orderservice:OrderService,private sanitizer: DomSanitizer) {
    this.productservice = productservice;
    this.orderservice = orderservice;
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
          //  =================get total price=========================
          var totalprice=0;
          this.cartitems.forEach(function(element:any){
            console.log(element);
           totalprice=totalprice+(element.item.quantity*element.item.productId.price);
           console.log(totalprice);
          });
        //  =================order to file output=========================
        var ordertoprint='';
        this.cartitems.map(function(element:any){
         return(  ordertoprint+=`Name:${element.item.productId.name},price:${element.item.productId.price},quantity:
         ${element.item.quantity},total_price:${element.item.quantity*element.item.productId.price} \r \n`
            )
        });
        
        console.log(ordertoprint);
        const data =`${ordertoprint}\r \n total order price:${totalprice}`;
        const blob = new Blob([data], { type: 'application/octet-stream' });
    
        this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
       });
         //  =================auth check=========================
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
          creditcart: new FormControl(null, { validators: [Validators.required] }),
            // const name = req.body.name;
      // const category = req.body.category;
      // const price = req.body.price;
      // const imagePath=url+"/images/"+req.file.filename;
    
        });
  }
  onMakeOrder() {
    if (this.form.invalid) {
      return;
    }
      this.orderservice.makeorder(
        this.form.value.city,
        this.form.value.street,
        this.form.value.date,
        this.form.value.creditcart,
         );
    
    this.form.reset();
  };

}
