import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginRequest } from '../models/api.models';

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
          // Navigate to dashboard after successful login
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.errorMessage = 'Invalid credentials. Please try again.';
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields.';
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


