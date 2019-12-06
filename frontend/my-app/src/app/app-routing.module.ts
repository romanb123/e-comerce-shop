import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Allproductscomponent } from './products/all-products/allproducts-component';
import { ProductCreateComponent } from './products/product-create/product-create-component';
import { OrderComponentComponent } from './order-component/order-component.component';
import { Logincomponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from "./auth/auth.guard";
import { AuthAdminGuard } from "./auth/auth.admin.guard";
import { AuthUserGuard } from "./auth/auth.user.guard";



const routes: Routes = [
  
  { path: '', component: Allproductscomponent,canActivate: [AuthGuard] },
  // { path: 'addpost', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'addproduct', component: ProductCreateComponent,canActivate: [AuthGuard,AuthAdminGuard] },
  // { path: 'edit/:postid', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:productid', component: ProductCreateComponent,canActivate: [AuthGuard,AuthAdminGuard]},
  { path: 'order', component: OrderComponentComponent,canActivate: [AuthGuard,AuthUserGuard] },
  { path: 'login', component: Logincomponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard,AuthAdminGuard,AuthUserGuard]
})
export class AppRoutingModule { }

