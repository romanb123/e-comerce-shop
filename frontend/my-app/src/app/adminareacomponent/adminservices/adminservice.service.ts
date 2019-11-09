import { Injectable } from '@angular/core';
import { Product } from '../../productmodel';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class Adminservice{
  private products: Product[] = [];
  private Updateproduct = new Subject<Product[]>();

  constructor(private http: HttpClient, private router: Router) { }
  addproduct(title: string, price: string, image: File,category:string,userId: string) {
    const productdata = new FormData();
    productdata.append('title', title);
    productdata.append('price', price);
    productdata.append('image', image, title);
    productdata.append('category', category);
    productdata.append('userId', userId);
    this.http.post<{ product: Product }>('http://localhost:3000/posts', productdata).subscribe((response) => {
        console.log(response.product.id);
        const product: Product = 
        { id: response.product.id,
          title: title,
          price: price, 
          image: response.product.image,
          category:category,
          userId:userId
           }
        this.products.push(product);
        this.Updateproduct.next([...this.products]);
    })

}
}
