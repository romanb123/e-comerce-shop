import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { AuthService } from "../auth.servise";

@Component({
templateUrl:'./login.component.html'
})
export class Logincomponent{

   loading = false;
   constructor(public authService: AuthService) {}


    onLogin(form: NgForm) {
        if (form.invalid) {
          return;
        }
        this.loading = true;
        this.authService.login(form.value.email, form.value.password);
      }
}