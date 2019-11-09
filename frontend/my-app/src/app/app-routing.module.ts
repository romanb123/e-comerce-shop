import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostCreateComponent } from './posts/post-create/post-create-component';
import { PostsListComponent } from './posts/post-list/post-list-component';
import { Logincomponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from "./auth/auth.guard";



const routes: Routes = [
  { path: '', component: PostsListComponent },
  { path: 'addpost', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:postid', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'login', component: Logincomponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }

