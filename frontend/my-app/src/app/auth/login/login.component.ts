import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from "../auth.servise";
import { Productservice } from "../../products/product-service";
import { OrderService } from "../../order-component/order-service.service";
import { Subscription } from 'rxjs';


@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class Logincomponent implements OnInit {
  private productsub: Subscription;
  productslenth: any;
  private orderssub: Subscription;
  orderslenght: any;
  user: any;
  private usersub: Subscription;
  role: any;
  private rolesub: Subscription;
  lastorder: any;
  private lastorderusersub: Subscription;


  loading = false;
  constructor(public authService: AuthService, public productservice: Productservice, public orderservice: OrderService) { }


  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.loading = true;
    this.authService.login(form.value.email, form.value.password);
  }

  ngOnInit() {

    // ========================================================================================================================
    // getproducrsnumber
    // ========================================================================================================================
    this.productservice.getproduct();
    this.productsub = this.productservice.productUpdatelistener()
      .subscribe((Product) => {
        this.productslenth = Product.length;
        console.log(this.productslenth);
      });
    // ========================================================================================================================
    // getordersnumber
    // ======================================================================================================================== 
    this.orderservice.getallorders();
    this.orderssub = this.orderservice.orderUpdatelistener()
      .subscribe((orders) => {
        this.orderslenght = orders.length;
        console.log(this.orderslenght+"fffffffffffffffffffffffffffffffff");
      });
    // ========================================================================================================================
    // getuserdata
    // ======================================================================================================================== 

    this.authService.updateuserdata();
    this.authService.getuser();
    this.usersub = this.authService.getuserupdated()
      .subscribe((user) => {
        this.user = user;
        this.orderservice.getuserlastorder();
        this.lastorderusersub = this.orderservice.getUpdateduserlasturder()
          .subscribe((lastorder) => {
            this.lastorder = lastorder;
            console.log(this.lastorder);
          });
        console.log(this.user);
      });

    // ========================================================================================================================
    // getrole
    // ======================================================================================================================== 
    // this.role=this.authService.getrole();
    // this.rolesub = this.authService.getroleupdated()
    //   .subscribe((role) => {
    //     this.role = role;
    //     console.log(this.role);
    //   });
  }
}