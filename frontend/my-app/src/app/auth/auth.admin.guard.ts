import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { AuthService } from "./auth.servise";

@Injectable()
export class AuthAdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): boolean | Observable<boolean> | Promise<boolean> {
    const userrole = this.authService.getrole();
    if (userrole!='admin') {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}