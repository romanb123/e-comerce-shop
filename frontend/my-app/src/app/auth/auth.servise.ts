import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

import { Authdata } from "./auth.model";

@Injectable({ providedIn: "root" })
export class AuthService {
  private token: string;
  private user:any;
  private updateduser = new Subject<any>();
  private isAuthenticated = false;
  private tokenTimer: any;
  private completed= false;
  private completedStatusListener = new Subject<boolean>();
  private message:string;
  private messageApdateListener = new Subject<string>();
  private authStatusListener = new Subject<boolean>();


  constructor(private http: HttpClient,private router: Router) {}
  getToken() {
    return this.token;
  }
  getuser() {
    return this.user;
  }
  getuserupdated() {
    return this.updateduser.asObservable();
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
  register_step1(passport: string, email: string,password:string,password_confirm:string) {
    const authData: any = {passport: passport, email: email,password:password,password_confirm:password_confirm};
    this.http.post<{value:boolean,message:string}>("http://localhost:3000/register_step1", authData)
      .subscribe(response => {
        console.log(response.value);
        this.message=response.message;
        this.completed=response.value;
        this.completedStatusListener.next(response.value);
        this.messageApdateListener.next(response.message);
      });
  }
  complitescheck() {
    return this.completed;
}
getcomplitedStatusListener() {
  return this.completedStatusListener.asObservable();
}

getmessage() {
  return this.message;
}
updatedMessageLissenter() {
return this.messageApdateListener.asObservable();
}
  createUser(city: string, street: string, name: string, lastname: string) {
    const authData: any = {city: city, street: street, name: name, lastname: lastname};
    this.http.post("http://localhost:3000/register", authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: Authdata = {email: email, password: password};
    this.http.post<{token: string,expiresIn: number,user:any}>("http://localhost:3000/login", authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const user = response.user;
          this.user = user;
          this.updateduser.next(response.user);
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate,user);
          // this.router.navigate(['/']);

        }

      })
  }

  private saveAuthData(token: string, expirationDate: Date,user:any) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("user", JSON.stringify(user));
  }
  
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
      const user = authInformation.user;
      this.user = user;
      this.updateduser.next(authInformation.user);
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }
  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
  logout() {
    this.token = null;
    this.user=null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("user");
  }
  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      user:user
    }
  }
}