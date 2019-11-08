import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.servise";

@Component({
  templateUrl: "./register.component.html"
})
export class RegisterComponent {
  loading = false;
  constructor(public authService: AuthService) {}

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.loading = true;
    this.authService.createUser(form.value.name,form.value.email, form.value.password);
  }
}
