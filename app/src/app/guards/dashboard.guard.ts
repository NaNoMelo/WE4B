import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.getCurrentUser().pipe(
      map(user => {
        if (user && user.roles) {
          // Check if user has only ROLE_ADMIN and no other roles
          const hasOnlyAdminRole = user.roles.length === 1 && user.roles.includes('ROLE_ADMIN');
          
          if (hasOnlyAdminRole) {
            // Redirect admin-only users to admin page
            return this.router.createUrlTree(['/admin']);
          }
          
          // Allow access for users with other roles (ROLE_USER, ROLE_TEACHER, or mixed roles)
          return true;
        }
        
        // Redirect to login if no user
        return this.router.createUrlTree(['/login']);
      })
    );
  }
}
