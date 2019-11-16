import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ProductCreateComponent } from './products/product-create/product-create-component';
import {ReactiveFormsModule,FormsModule} from '@angular/forms';
import {MatInputModule,MatMenuModule,MatToolbarModule,MatExpansionModule,MatButtonModule,MatProgressSpinnerModule,MatGridListModule} from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule,HTTP_INTERCEPTORS} from '@angular/common/http';
import {MatCardModule} from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NavbarComponent} from './navbar/navbar';
import {Allproductscomponent} from './products/all-products/allproducts-component';
import {Logincomponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import { Addtoken } from "./auth/auth.addtoken";
import { OrderComponentComponent } from './order-component/order-component.component';

@NgModule({
  declarations: [
    AppComponent,ProductCreateComponent,NavbarComponent,Allproductscomponent,Logincomponent,RegisterComponent, OrderComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatExpansionModule,
    MatToolbarModule,
    HttpClientModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatGridListModule
  ],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: Addtoken, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
