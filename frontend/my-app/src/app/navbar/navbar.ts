import { Component,OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.servise";


@Component({
  selector: 'navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit, OnDestroy{

    userIsAuthenticated = false;
    private authListenerSubs: Subscription;
    // ==============================================
    userrole:any;
    private updateduserrole: Subscription; 
    // ============================================== 
    constructor(private authService: AuthService) {}



    ngOnInit() {
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authListenerSubs = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
        });
        // ============================================
        this.userrole=this.authService.getrole();
        this.updateduserrole=this.authService.getroleupdated()
        .subscribe(role => {
          this.userrole = role;
        });
    }
    ngOnDestroy() {
      this.authListenerSubs.unsubscribe();
    }
    onLogout() {
      this.authService.logout();
    }
}