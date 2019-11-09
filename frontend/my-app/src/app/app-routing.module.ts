import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserareaComponent} from './userareacomponent/userarea.component';
import {AdminareaComponent} from './adminareacomponent/adminarea.component';




const routes: Routes = [
  { path: '', component: AdminareaComponent },
  { path: 'admin', component:AdminareaComponent },
  { path: 'user', component:UserareaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
