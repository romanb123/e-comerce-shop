import { Order } from './order-model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [];
  private UpdatedOrders = new Subject<Order[]>();
  constructor(private http: HttpClient, private router: Router){ }

  makeorder(city: string,street: string,date:string,creditcart:string) {
   
    
    this.http.post<any>('http://localhost:3000/makeorder',{city:city,street:street,date:date,creditcart:creditcart}).subscribe((response) => {
        console.log(response);
        const order: Order = { 
          city: city,street: street,date:date,creditcart:creditcart
        }
        this.orders.push(order);
        this.UpdatedOrders.next([...this.orders]);
        this.router.navigate(['/']);
    })

}

orderUpdatelistener() {
    return this.UpdatedOrders.asObservable();
}
}
