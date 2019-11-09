import { Product } from './productmodel';
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
    constructor(private http: HttpClient, private router: Router) {
    }

    getproduct() {
        this.http.get<any>('http://localhost:3000/posts')
            .pipe(map((postData) => {
                return postData.map(post => {
                    return {
                        title: post.title,
                        body: post.body,
                        id: post._id, 
                        imagePath: post.imagePath
                    };
                });
            }))
            .subscribe((transfotmrdpostes) => {
                this.products = transfotmrdpostes;
                this.UpdatedProduct.next([...this.products]);
            });
    }

    postUpdatelistener() {
        return this.UpdatedProduct.asObservable();
    }

    gesingle(id: string) {
        return this.http.get<{ _id: string, body: string, title: string,imagePath: string }>('http://localhost:3000/singlepost/' + id);
    }

    addproduct(id: string,title: string,price: string, description: string, image: File,category: string,userId:string) {
        const product = new FormData();
        product.append('id', id);
        product.append('price', price);
        product.append('description', description);
        product.append('image', image, title);
        product.append('category', category);
        product.append('userId', userId);
        
        this.http.post<{ product: Product }>('http://localhost:3000/addproduct',product).subscribe((response) => {
            console.log(response.product.id);
            const product: Product = { 
                id: response.product.id,title:title, imagePath: response.product.imagePath,price:price,
                category:category, userId:userId
            }
            this.products.push(product);
            this.UpdatedProduct.next([...this.products]);
            this.router.navigate(['/']);
        })

    }
    // id: string,
    // title: string,
    // price: string,
    // description: string,
    // imagePath:response.post.imagePath,
    // category: string,
    // userId:string;
    updateproduct(id: string, title: string, price: string,description: string,category: string,userId: string,image: File | string ) {
       let productData: Product | FormData;
    if (typeof image === "object") {
        productData = new FormData();
        productData.append("id", id);
        productData.append("title", title);
        productData.append("price", price);
        productData.append("description", description);
        productData.append("category", category);
        productData.append("userId", userId);
        productData.append("image", image, title);
    } else {
        productData = {
            id: id,
            title: title,
            price: price,
            category: category,
            userId: userId,
        imagePath: image
      };
    }
        this.http.put('http://localhost:3000/posts/' + id, productData).subscribe(response => {
            const updatedproducts = [...this.products];
            const oldroductid = updatedproducts.findIndex(p => {
                p.id === id;
            });
            const product: Product = {
                id: id,
                title: title,
                price: price,
                category: category,
                userId: userId,
            imagePath: ""
              };
            updatedproducts[oldroductid] = product;
            this.products = updatedproducts;
            this.UpdatedProduct.next([...this.products]);
            this.router.navigate(['/']);
        })
    }

}