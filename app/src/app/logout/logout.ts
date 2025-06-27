import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-logout',
  imports: [CommonModule, RouterModule],
  templateUrl: './logout.html',
  styleUrl: './logout.scss'
})
export class Logout implements OnInit, OnDestroy {
  protected countdown: number = 10;
  private intervalId: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Perform logout
    this.authService.logout();
    
    // Start countdown
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private startCountdown(): void {
    this.intervalId = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.intervalId);
        this.router.navigate(['/login']);
      }
    }, 1000);
  }

  onReturnToLogin(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.router.navigate(['/login']);
  }
}
