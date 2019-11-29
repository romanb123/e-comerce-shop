import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from "../auth.servise";
import { Productservice } from "../../products/product-service";
import { Subscription } from 'rxjs';


@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class Logincomponent implements OnInit {
  private productsub: Subscription;
  productslenth:any;

  loading = false;
  constructor(public authService: AuthService, public productservice: Productservice) { }


  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.loading = true;
    this.authService.login(form.value.email, form.value.password);
  }

  ngOnInit() {
    this.productservice.getproduct();
    this.productsub = this.productservice.productUpdatelistener()
      .subscribe((Product) => {
        this.loading = false;
        this.productslenth = Product.length;
        console.log(this.productslenth);
      });
  }
}