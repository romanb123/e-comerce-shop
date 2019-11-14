import { Product } from './productmodel';
import { CartItem } from './cartitemmodel';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({ providedIn: 'root' })


export class Productservice {
    private products: Product[] = [];
    private UpdatedProduct = new Subject<Product[]>();
    private cartitems: CartItem[] = [];
    private UpdatedCartItem = new Subject<CartItem[]>();
    constructor(private http: HttpClient, private router: Router) {
    }

 // ===========cart data and actions======================================================   
 getcartitems() {
    this.http.get<any>('http://localhost:3000/viewcart')
        .pipe(map((cartData) => {
            return cartData.map(item => {
                return {
                 item:item
                };
            });
        }))
        .subscribe((transfotmpcartitems) => {
            this.cartitems = transfotmpcartitems;
            this.UpdatedCartItem.next([...this.cartitems]);
        });
}

cartitemsUpdatelistener() {
    return this.UpdatedCartItem.asObservable();
}

// ===========products data and actions======================================================
    getproduct() {
        this.http.get<any>('http://localhost:3000/products')
            .pipe(map((productData) => {
                return productData.map(prod => {
                    return {
                        name: prod.name,
                        category: prod.category,
                        price: prod.price, 
                        image: prod.image,
                        id:prod._id
                    };
                });
            }))
            .subscribe((transfotmproducts) => {
                this.products = transfotmproducts;
                this.UpdatedProduct.next([...this.products]);
            });
    }

    productUpdatelistener() {
        return this.UpdatedProduct.asObservable();
    }

    gesingle(id: string) {
        return this.http.get<{ id: string, name: string,price: string, category: string,image: string }>('http://localhost:3000/singleproduct/' + id);
    }
 
  // const name = req.body.name;
  // const category = req.body.category;
  // const price = req.body.price;
  // const imagePath=url+"/images/"+req.file.filename;
    addproduct(name: string,category: string,price: string, image: File) {
        const product = new FormData();
        product.append('name', name);
        product.append('category', category);
        product.append('price', price);
        product.append('image', image, name);
        
        this.http.post<any>('http://localhost:3000/addproduct',product).subscribe((response) => {
            console.log(response);
            const product: Product = { 
                id: response._id,name:name, image: response.image,category:category,
                price:price, 
            }
            this.products.push(product);
            this.UpdatedProduct.next([...this.products]);
            this.router.navigate(['/']);
        })

    }



    addtocart(id: string) {
        this.http.post<any>('http://localhost:3000/addtocart/',{productId:id}).subscribe((response) => {
           this.getcartitems();
        })
    }
   // const name = req.body.name;
  // const category = req.body.category;
  // const price = req.body.price;
  // const imagePath=url+"/images/"+req.file.filename;
    updateproduct(id:string, name:string, price: string,category:string ,image: File | string ) {
        console.log("id"+id+"name"+name)
       let productData: Product | FormData;
    if (typeof image === "object") {
        productData = new FormData();
        productData.append("id", id);
        productData.append("name", name);
        productData.append("price", price);
        productData.append("category", category);
        productData.append("image", image, name);
    } else {
        productData = {
            id: id,
            name: name,
            price: price,
            category: category,
            image: image
      };
    }
        this.http.put('http://localhost:3000/updateproduct/' + id, productData).subscribe(response => {
            const updatedproducts = [...this.products];
            const oldroductid = updatedproducts.findIndex(p => {
                p.id === id;
            });
            const product: Product = {
                id: id,
                name: name,
                price: price,
                category: category,
                image: ""
              };
            updatedproducts[oldroductid] = product;
            this.products = updatedproducts;
            this.UpdatedProduct.next([...this.products]);
            this.router.navigate(['/']);
        })
    }

}