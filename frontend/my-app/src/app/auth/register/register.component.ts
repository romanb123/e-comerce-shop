import { Component,OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.servise";
import { Subscription } from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  templateUrl: "./register.component.html"
})
export class RegisterComponent implements OnInit {
  isLinear = true;
  message:string;
  private messageApdateSub: Subscription;
  isCompleted=false;
  private complitedstatusSub: Subscription;
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
      city: ['', Validators.required],
      street: ['', Validators.required],
      name: ['', Validators.required],
      lastname: ['', Validators.required]
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
       this.isCompleted = this.authService.complitescheck();
       this.complitedstatusSub = this.authService
         .getcomplitedStatusListener()
         .subscribe(iscompleted => {
           this.isCompleted = iscompleted;
           console.log(this.isCompleted);
         });

         this.message = this.authService.getmessage();
       this.messageApdateSub = this.authService
         .updatedMessageLissenter()
         .subscribe(message => {
           this.message = message;
           console.log(this.message);
         });
  
}
  onSignup() {
    if (this.secondFormGroup.invalid) {
      return;
    }
    this.loading = true;
    this.authService.createUser(   
      this.secondFormGroup.value.city,
      this.secondFormGroup.value.street,
      this.secondFormGroup.value.name,
      this.secondFormGroup.value.lastname,);
  }
}
