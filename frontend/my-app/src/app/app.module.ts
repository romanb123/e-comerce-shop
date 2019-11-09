import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import {ReactiveFormsModule,FormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import {MatCardModule} from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { AdminareaComponent } from './adminareacomponent/adminarea.component';
import { UserareaComponent } from './userareacomponent/userarea.component'; 
import {MatInputModule,MatMenuModule,MatToolbarModule,MatExpansionModule,MatButtonModule,MatProgressSpinnerModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AdminareaComponent,
    UserareaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatInputModule,
    MatMenuModule,
    MatExpansionModule,
    MatToolbarModule,
    HttpClientModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule

    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
