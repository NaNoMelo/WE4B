import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginRequest } from '../models/api.models';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  protected loginForm: FormGroup;
  protected hidePassword: boolean = true;
  protected isLoading: boolean = false;
  protected errorMessage: string = '';
  protected mockData: boolean = environment.useMockData; // Show mock data info if enabled

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const credentials: LoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.isLoading = false;
          
          // Use intelligent routing based on user role
          const user = response.user;
          if (user && user.roles) {
            const hasOnlyAdminRole = user.roles.length === 1 && user.roles.includes('ROLE_ADMIN');
            
            if (hasOnlyAdminRole) {
              // Redirect admin-only users to admin page
              this.router.navigate(['/admin']);
            } else {
              // Redirect other users to dashboard
              this.router.navigate(['/dashboard']);
            }
          } else {
            // Fallback to dashboard
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.errorMessage = 'E-mail ou mot de passe incorrect.';
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs requis.';
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
    const passwordField = document.querySelector<HTMLInputElement>('#password');
    if (passwordField) {
      passwordField.type = this.hidePassword ? 'password' : 'text';
    }
  }
}


