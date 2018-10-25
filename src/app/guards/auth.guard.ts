import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
// import { UserService } from './user.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService,
              private router: Router,
              // private user: UserService
            ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      // if (!this.auth.isLoggedIn) {
      //   this.router.navigate(['login']);
      // }
    // return this.auth.isLoggedIn;
    console.log('auth guard.........');
    if (this.auth.loggedIn) {
      return true;
    }
    // return this.user.isLoggedIn().pipe(map(res => {
    //   if (res.status) {
    //     this.auth.setLoggedIn(true);
    //     return true;
    //   }

        this.router.navigate(['login']);
        return false;

    // } ));
  }
}
