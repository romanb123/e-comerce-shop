import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

import { Authdata } from "./auth.model";

@Injectable({ providedIn: "root" })
export class AuthService {
  // token
  private token: string;
  // user+apdateduser
  private user: any;
  private updateduser = new Subject<any>();
   // role+apdaterole
  private role: any;
  private updatedrole = new Subject<any>();
  // if is auth+auth status
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  // tokentimer
  private tokenTimer: any;
  // completed first registration step
  private completed = false;
  private completedStatusListener = new Subject<boolean>();
   // first registration step response from server
  private message: string;
  private messageApdateListener = new Subject<string>();
  


  constructor(private http: HttpClient, private router: Router) { }
//======================================================================================================================
// get token
//======================================================================================================================
  getToken() {
    return this.token;
  }
//======================================================================================================================
// get user data
//======================================================================================================================
  getuser() {
    return this.user;
  }
  getuserupdated() {
    return this.updateduser.asObservable();
  }
//======================================================================================================================
// get role data
//======================================================================================================================

  getrole() {
    return this.role;
  }
  getroleupdated() {
    return this.updatedrole.asObservable();
  }
  
//======================================================================================================================
// get auth status
//======================================================================================================================


  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
//======================================================================================================================
// register step 1
//======================================================================================================================
  register_step1(passport: string, email: string, password: string, password_confirm: string) {
    const authData: any = { passport: passport, email: email, password: password, password_confirm: password_confirm };
    this.http.post<{ value: boolean, message: string }>("http://localhost:3000/register_step1", authData)
      .subscribe(response => {
        console.log(response.value);
        this.message = response.message;
        this.completed = response.value;
        this.completedStatusListener.next(response.value);
        this.messageApdateListener.next(response.message);
      });
  }
//======================================================================================================================
//check ih  register step 1 completed
//======================================================================================================================
  complitescheck() {
    return this.completed;
  }
  getcomplitedStatusListener() {
    return this.completedStatusListener.asObservable();
  }

//======================================================================================================================
//get response from server if the values of step 1 are valid
//======================================================================================================================

  getmessage() {
    return this.message;
  }
  updatedMessageLissenter() {
    return this.messageApdateListener.asObservable();
  }
//======================================================================================================================
//register step 2-filan step
//======================================================================================================================
  createUser(city: string, street: string, name: string, lastname: string) {
    const authData: any = { city: city, street: street, name: name, lastname: lastname };
    this.http.post("http://localhost:3000/register", authData)
      .subscribe(response => {
        console.log(response);
      });
  }
//======================================================================================================================
//login
//======================================================================================================================
  login(email: string, password: string) {
    const authData: Authdata = { email: email, password: password };
    this.http.post<{ token: string, expiresIn: number, role: string,user:any }>("http://localhost:3000/login", authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.user = response.user;
          this.updateduser.next(response.user);
          const role = response.role;
          this.role = role;
          this.updatedrole.next(response.role);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate, role);
          // this.router.navigate(['/']);

        }

      })
  }


//======================================================================================================================
//update user data if user return to first screen
//======================================================================================================================
  updateuserdata() {
    return this.http.get<any>
      ('http://localhost:3000/userdata').subscribe((transfotmpuser) => {
        this.user = transfotmpuser;
        this.updateduser.next(transfotmpuser);
        console.log(this.user);
      });;
  }

//======================================================================================================================
//save auth data to local storage
//======================================================================================================================

  private saveAuthData(token: string, expirationDate: Date, role: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("role", role);

  }
//======================================================================================================================
//auto auth logged user
//======================================================================================================================
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

//======================================================================================================================
//set timer of validity of the token
//======================================================================================================================
  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

//======================================================================================================================
//logout
//======================================================================================================================
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.user = null;
    this.updateduser.next(null);
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }
//======================================================================================================================
//remove auth data from local storage
//======================================================================================================================
  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("role");
  }
//======================================================================================================================
//get auth data from local storage
//======================================================================================================================
  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const role = localStorage.getItem("role");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      role: role,
    }
  }
}