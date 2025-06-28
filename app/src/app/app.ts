import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { User } from './models/api.models';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected title = 'app';
  protected user: User | null = null;
  protected showNavigation = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.checkRouteForNavigation();
    
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkRouteForNavigation();
      this.loadUserData(); // Reload user data on route changes
    });
  }

  private checkRouteForNavigation(): void {
    const currentUrl = this.router.url;
    const noNavRoutes = ['/login', '/logout'];
    this.showNavigation = !noNavRoutes.some(route => currentUrl.startsWith(route));
  }

  private loadUserData(): void {
    if (this.authService.isAuthenticated()) {
      this.authService.getCurrentUser().subscribe({
        next: (user: User) => {
          this.user = user;
        },
        error: (error: any) => {
          console.error('Error loading user data:', error);
          this.user = null;
        }
      });
    } else {
      this.user = null;
    }

    // Register Admin test account if not in production
    if (!environment.production){
      const adminEmail = 'admin@te.st';
      const adminPassword = 'admin';
      const adminName = 'Admin';
      const adminFirstName = 'Test';
      const adminRoles = ['ROLE_ADMIN'];

      this.authService.register({
        email: adminEmail,
        password: adminPassword,
        name: adminName,
        first_name: adminFirstName,
        roles: adminRoles
      }).subscribe({
        next: (response) => {
          console.log('Admin test account registered:', response);
        },
        error: (error) => {
          console.error('Error registering admin test account:', error);
        }
      });

    }
  }

  // Check if user has only admin role
  protected isAdminOnly(): boolean {
    return this.user?.roles?.length === 1 && this.user.roles.includes('ROLE_ADMIN') || false;
  }

  // Get user role display text in French
  protected getUserRoleDisplayText(): string {
    if (!this.user?.roles?.length) return '';
    
    const roleLabels: { [key: string]: string } = {
      'ROLE_ADMIN': 'Administrateur',
      'ROLE_TEACHER': 'Enseignant',
      'ROLE_USER': 'Étudiant'
    };

    // If multiple roles, show the highest priority role
    if (this.user.roles.includes('ROLE_ADMIN')) {
      return roleLabels['ROLE_ADMIN'];
    } else if (this.user.roles.includes('ROLE_TEACHER')) {
      return roleLabels['ROLE_TEACHER'];
    } else if (this.user.roles.includes('ROLE_USER')) {
      return roleLabels['ROLE_USER'];
    }

    return this.user.roles[0]; // Fallback to raw role name
  }
}
