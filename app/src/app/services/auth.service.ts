import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { User, LoginRequest, RegisterRequest, LoginResponse } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiService {
  private currentUserData: User | null = null;

  constructor(http: HttpClient) {
    super(http);
    // Load user data from localStorage on service initialization
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        this.currentUserData = JSON.parse(storedUser);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserData = user;
  }

  private clearUserFromStorage(): void {
    localStorage.removeItem('currentUser');
    this.currentUserData = null;
  }

  // GET /auth/me - Get current authenticated user
  getCurrentUser(): Observable<User> {
    const token = this.getToken();
    if (token && this.currentUserData) {
      return of(this.currentUserData);
    }
    
    // Return empty user if no token or user data
    const emptyUser: User = {
      id: '',
      email: '',
      name: '',
      first_name: '',
      roles: []
    };
    return of(emptyUser);
  }

  // Check if user is authenticated
  override isAuthenticated(): boolean {
    const token = this.getToken();
    return !!(token && this.currentUserData && this.currentUserData.id);
  }

  // POST /auth/login - Log in
  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('Login attempt:', credentials);
    
    // Mock users for development
    const mockUsers: { [email: string]: User } = {
      'student@example.com': {
        id: '1',
        email: 'student@example.com',
        name: 'Dupont',
        first_name: 'Jean',
        roles: ['ROLE_USER']
      },
      'teacher@example.com': {
        id: '2',
        email: 'teacher@example.com',
        name: 'Martin',
        first_name: 'Marie',
        roles: ['ROLE_TEACHER']
      },
      'admin@example.com': {
        id: '3',
        email: 'admin@example.com',
        name: 'Admin',
        first_name: 'Super',
        roles: ['ROLE_ADMIN']
      },
      'teacher.admin@example.com': {
        id: '4',
        email: 'teacher.admin@example.com',
        name: 'Professeur',
        first_name: 'Pierre',
        roles: ['ROLE_TEACHER', 'ROLE_ADMIN']
      }
    };
    
    // Check if user exists
    const user = mockUsers[credentials.email];
    if (!user) {
      // Return error observable for unknown email
      return throwError(() => new Error('Email ou mot de passe incorrect'));
    }
    
    // For development, accept any password
    const fakeResponse: LoginResponse = {
      token: 'fake-jwt-token-' + Date.now(),
      user: user
    };
    
    // Set the fake token and store user data
    this.setToken(fakeResponse.token);
    this.saveUserToStorage(user);
    
    return of(fakeResponse);
    // Real implementation: return this.post<LoginResponse>('/auth/login', credentials);
  }

  // POST /auth/register - Register a new user
  register(userData: RegisterRequest): Observable<any> {
    // Mock response for development
    console.log('Registration attempt:', userData);
    
    // Simulate successful registration
    const mockResponse = {
      message: 'User registered successfully',
      user: {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        first_name: userData.first_name,
        roles: userData.roles
      }
    };
    
    return of(mockResponse);
  }

  // Logout user
  logout(): void {
    this.removeToken();
    this.clearUserFromStorage();
  }

  // Helper methods for role checking
  hasRole(role: string): boolean {
    return this.currentUserData?.roles?.includes(role) || false;
  }

  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }

  isTeacher(): boolean {
    return this.hasRole('ROLE_TEACHER');
  }

  isUser(): boolean {
    return this.hasRole('ROLE_USER');
  }
}
