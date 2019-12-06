import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Allproductscomponent } from './products/all-products/allproducts-component';
import { ProductCreateComponent } from './products/product-create/product-create-component';
import { OrderComponentComponent } from './order-component/order-component.component';
import { Logincomponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from "./auth/auth.guard";



const routes: Routes = [
  
  { path: '', component: Allproductscomponent,canActivate: [AuthGuard] },
  // { path: 'addpost', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'addpost', component: ProductCreateComponent },
  // { path: 'edit/:postid', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:productid', component: ProductCreateComponent},
  { path: 'order', component: OrderComponentComponent },
  { path: 'login', component: Logincomponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }

