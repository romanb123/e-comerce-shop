import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ProductserviceService {
  private products: any;
  url = 'http://localhost:3000/products';
  constructor(private http: HttpClient) { }

  getproduct():Observable<any> {
    return this.http.get<any>(`${this.url}`);

}
}
