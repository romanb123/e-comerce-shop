import { Component, OnInit } from '@angular/core';
import {Product} from '../productmodel';
import { NgForm } from "@angular/forms";

import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { Adminservice } from '../adminareacomponent/adminservices/adminservice.service';
import { ActivatedRoute, ParamMap } from "@angular/router";


@Component({
  selector: 'app-adminarea',
  templateUrl: './adminarea.component.html',
  styleUrls: ['./adminarea.component.css']
})
export class AdminareaComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  product: Product;


  constructor(
    public adminservice: Adminservice,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
  }

  onAddProduct(form: NgForm) {
    if (form.invalid) {
      return;
    }

 
      this.adminservice.addproduct(form.value.title, form.value.content);

    
    form.resetForm();
  }
}