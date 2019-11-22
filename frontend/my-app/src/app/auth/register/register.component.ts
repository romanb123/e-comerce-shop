import { Component,OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.servise";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  templateUrl: "./register.component.html"
})
export class RegisterComponent implements OnInit {
  isLinear = true;
  isCompleted=false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  loading = false;
  constructor(public authService: AuthService,private _formBuilder: FormBuilder) {}
  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      passport: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      password_confirm: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }
onStep1(){
  if (this.firstFormGroup.invalid) {
    return;
  }
    this.authService.register_step1(
      this.firstFormGroup.value.passport,
      this.firstFormGroup.value.email,
      this.firstFormGroup.value.password,
      this.firstFormGroup.value.password_confirm,
       );
  
}
  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.loading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }
}
