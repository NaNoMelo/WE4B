import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService } from '../services/course.service';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { Course, User, Notification } from '../models/api.models';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  protected courses: Course[] = [];
  protected currentUser: User | null = null;
  protected notifications: Notification[] = [];
  protected isLoading: boolean = true;

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadCourses();
    this.loadNotifications();
  }

  private loadUserData(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.currentUser = user;
      },
      error: (error: any) => {
        console.error('Error loading user data:', error);
      }
    });
  }

  private loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (courses: Course[]) => {
        this.courses = courses;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading courses:', error);
        this.isLoading = false;
      }
    });
  }

  private loadNotifications(): void {
    this.notificationService.getAllNotifications().subscribe({
      next: (notifications: Notification[]) => {
        this.notifications = notifications;
      },
      error: (error: any) => {
        console.error('Error loading notifications:', error);
      }
    });
  }

  getCourseImageUrl(courseId: number): string {
    // Use an online placeholder image service, seeding with the course ID for consistency.
    return `https://picsum.photos/seed/395/300/200`;
  }
}
