import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PostCreateComponent } from './posts/post-create/post-create-component';
import {ReactiveFormsModule,FormsModule} from '@angular/forms';
import {MatInputModule,MatMenuModule,MatToolbarModule,MatExpansionModule,MatButtonModule,MatProgressSpinnerModule} from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule,HTTP_INTERCEPTORS} from '@angular/common/http';
import {MatCardModule} from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NavbarComponent} from './navbar/navbar';
import {PostsListComponent} from './posts/post-list/post-list-component';
import {Logincomponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import { Addtoken } from "./auth/auth.addtoken";

@NgModule({
  declarations: [
    AppComponent,PostCreateComponent,NavbarComponent,PostsListComponent,Logincomponent,RegisterComponent
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
    FormsModule
  ],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: Addtoken, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
