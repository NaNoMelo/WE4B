import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard {

  constructor(private router: Router) {}

  navigateToLogs(): void {
    this.router.navigate(['/logs']);
  }

  navigateToAdminPage(): void {
    this.router.navigate(['/admin-gestion']);
  }
}
