import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Check if user has a valid token
    if (!this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/login']);
    }

    return this.authService.getCurrentUser().pipe(
      map(user => {
        if (user && user.roles && user.roles.length > 0) {
          // Check if user has only ROLE_ADMIN and no other roles
          const hasOnlyAdminRole = user.roles.length === 1 && user.roles.includes('ROLE_ADMIN');
          
          if (hasOnlyAdminRole) {
            // Redirect admin-only users to admin page
            return this.router.createUrlTree(['/admin']);
          }
          
          // For other users (ROLE_USER, ROLE_TEACHER, or mixed roles), redirect to dashboard
          return this.router.createUrlTree(['/dashboard']);
        }
        
        // If no roles, redirect to login
        return this.router.createUrlTree(['/login']);
      })
    );
  }
}
