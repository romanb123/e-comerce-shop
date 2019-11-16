import { Order } from './order-module';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class OrderServiceService {
  private orders: Order[] = [];
  private UpdatedOrders = new Subject<Order[]>();
  constructor(private http: HttpClient, private router: Router){ }

  getorders() {
    this.http.get<any>('http://localhost:3000/showorders')
        .pipe(map((ordertData) => {
            return ordertData.map(order => {
                return {
                  order:order
                };
            });
        }))
        .subscribe((transfotmporders) => {
            this.orders = transfotmporders;
            this.UpdatedOrders.next([...this.orders]);
        });
}

cartitemsUpdatelistener() {
    return this.UpdatedOrders.asObservable();
}
}
