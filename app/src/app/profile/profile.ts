import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/api.models';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  protected user: User | null = null;
  protected isLoading: boolean = true;
  protected success: boolean | null = null;
  protected message: string = '';
  protected password: string = '';
  protected confirmPassword: string = '';

  // Role labels in French
  protected roleLabels: { [key: string]: string } = {
    'ROLE_ADMIN': 'Administrateur',
    'ROLE_TEACHER': 'Enseignant', 
    'ROLE_USER': 'Étudiant'
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    if (this.authService.isAuthenticated()) {
      this.authService.getCurrentUser().subscribe({
        next: (user: User) => {
          this.user = user;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error loading user profile:', error);
          this.isLoading = false;
          this.message = 'Erreur lors du chargement du profil';
          this.success = false;
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  onSubmit(): void {
    if (!this.user) return;

    // Validate password confirmation if password is provided
    if (this.password && this.password !== this.confirmPassword) {
      this.message = 'Les mots de passe ne correspondent pas';
      this.success = false;
      return;
    }

    // Here you would typically call a user update service
    // For now, we'll simulate a successful update
    this.message = 'Profil mis à jour avec succès';
    this.success = true;
    
    // Clear password fields after successful update
    this.password = '';
    this.confirmPassword = '';
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }

  getRoleDisplayText(): string {
    if (!this.user?.roles?.length) return '';
    
    // If multiple roles, show the highest priority role
    if (this.user.roles.includes('ROLE_ADMIN')) {
      return this.roleLabels['ROLE_ADMIN'];
    } else if (this.user.roles.includes('ROLE_TEACHER')) {
      return this.roleLabels['ROLE_TEACHER'];
    } else if (this.user.roles.includes('ROLE_USER')) {
      return this.roleLabels['ROLE_USER'];
    }

    return this.user.roles[0]; // Fallback to raw role name
  }
}
