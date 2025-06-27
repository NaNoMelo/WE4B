import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CourseService } from '../services/course.service';
import { RegisterRequest, Course } from '../models/api.models';

@Component({
  selector: 'app-create-user',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-user.html',
  styleUrl: './create-user.scss'
})
export class CreateUser implements OnInit {
  protected message: string = '';
  protected success: boolean = false;
  protected isLoading: boolean = false;
  
  protected user: RegisterRequest = {
    email: '',
    name: '',
    first_name: '',
    password: '',
    roles: []
  };

  protected confirmPassword: string = '';
  
  // Available roles
  protected availableRoles: string[] = ['ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_USER'];
  
  protected courses: Course[] = [];
  protected userCourseIds: string[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  private loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (courses: Course[]) => {
        this.courses = courses;
      },
      error: (error: any) => {
        console.error('Error loading courses:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.user.password !== this.confirmPassword) {
      this.message = 'Les mots de passe ne correspondent pas!';
      this.success = false;
      return;
    }

    this.isLoading = true;
    console.log('Creating user:', this.user);
    console.log('Associated Courses:', this.userCourseIds);
    
    this.authService.register(this.user).subscribe({
      next: (response: any) => {
        console.log('User created successfully:', response);
        this.message = 'Utilisateur créé avec succès!';
        this.success = true;
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 1500);
      },
      error: (error: any) => {
        console.error('Error creating user:', error);
        this.message = 'Erreur lors de la création de l\'utilisateur';
        this.success = false;
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin']);
  }

  onCourseToggle(courseId: string, event: any): void {
    if (event.target.checked) {
      this.userCourseIds.push(courseId);
    } else {
      this.userCourseIds = this.userCourseIds.filter((id: string) => id !== courseId);
    }
  }

  onRoleToggle(role: string, event: any): void {
    if (event.target.checked) {
      if (!this.user.roles.includes(role)) {
        this.user.roles.push(role);
      }
    } else {
      this.user.roles = this.user.roles.filter((r: string) => r !== role);
    }
  }
}
