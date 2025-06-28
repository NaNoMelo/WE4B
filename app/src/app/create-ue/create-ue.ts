import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { UserService } from '../services/user.service';
import { Course, User } from '../models/api.models';

@Component({
  selector: 'app-create-ue',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-ue.html',
  styleUrl: './create-ue.scss'
})
export class CreateUe implements OnInit {
  protected message: string = '';
  protected success: boolean = false;
  protected isLoading: boolean = false;
  protected currentImageUrl: string = '';
  
  protected course: Partial<Course> = {
    name: '',
    code: '',
    description: '',
    user_responsible_id: ''
  };

  protected teachers: User[] = [];

  constructor(
    private router: Router,
    private courseService: CourseService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  private loadTeachers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        // Filter users to show only teachers/admins
        this.teachers = users.filter(user => 
          user.roles.includes('ROLE_TEACHER') || 
          user.roles.includes('ROLE_ADMIN')
        );
      },
      error: (error: any) => {
        console.error('Error loading teachers:', error);
      }
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    console.log('Creating Course:', this.course);
    
    this.courseService.createCourse(this.course as Course).subscribe({
      next: (createdCourse: Course) => {
        console.log('Course created successfully:', createdCourse);
        this.message = 'UE créée avec succès!';
        this.success = true;
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 1500);
      },
      error: (error: any) => {
        console.error('Error creating course:', error);
        this.message = 'Erreur lors de la création de l\'UE';
        this.success = false;
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin']);
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
      // Handle file upload logic here
    }
  }
}
