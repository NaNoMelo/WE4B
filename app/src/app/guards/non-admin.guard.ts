import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NonAdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.getCurrentUser().pipe(
      map(user => {
        // Allow access for users who have ROLE_TEACHER or ROLE_USER (students)
        // This includes admin teachers who have both ROLE_ADMIN and ROLE_TEACHER
        if (user && user.roles && (user.roles.includes('ROLE_TEACHER') || user.roles.includes('ROLE_USER'))) {
          return true;
        }
        // Redirect pure admins (only ROLE_ADMIN, no ROLE_TEACHER) to the admin dashboard
        return this.router.createUrlTree(['/admin']);
      })
    );
  }
}
