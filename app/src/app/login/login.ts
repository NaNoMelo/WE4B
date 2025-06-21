import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  protected loginForm: FormGroup;
  protected hidePassword: boolean = true;

  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl('')
    });
  }

  onSubmit() {
    console.log('Login form submitted:', this.loginForm.value);
    // Here you would typically handle the login logic, e.g., call an authentication service
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
    const passwordField = document.querySelector<HTMLInputElement>('#password');
    if (passwordField) {
      passwordField.type = this.hidePassword ? 'password' : 'text';
    }
  }
}


