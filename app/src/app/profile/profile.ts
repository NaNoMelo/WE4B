import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { User } from '../models/api.models';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  protected user: User | null = null;
  protected isLoading: boolean = true;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.user = user;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading user profile:', error);
        this.isLoading = false;
      }
    });
  }
}
