import { Component, OnInit } from '@angular/core';
import { ProductserviceService } from '../productservice.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
products:any;
  constructor(private ProductserviceService: ProductserviceService) { }

  ngOnInit() {
 this.ProductserviceService.getproduct()
      .subscribe((products) => {
        this.products = products;
        console.log(products);
      });
  }

}
