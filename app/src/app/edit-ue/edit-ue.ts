import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CourseService } from '../services/course.service';
import { UserService } from '../services/user.service';
import { Course, User } from '../models/api.models';

@Component({
  selector: 'app-edit-ue',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-ue.html',
  styleUrl: './edit-ue.scss'
})
export class EditUe implements OnInit {
  protected ueId: string = '';
  protected message: string = '';
  protected success: boolean = false;
  protected currentImageUrl: string = '';
  protected isLoading: boolean = true;
  
  protected course: Course = {
    id: '',
    name: '',
    code: '',
    description: '',
    creation_date: '',
    user_responsible_id: ''
  };

  protected teachers: User[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.ueId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.ueId) {
      this.isLoading = false;
      this.message = 'ID de l\'UE non trouvé.';
      this.success = false;
      return;
    }

    forkJoin({
      users: this.userService.getAllUsers(),
      course: this.courseService.getCourseById(this.ueId)
    }).subscribe({
      next: ({ users, course }) => {
        this.teachers = users.filter(user => 
          user.roles.includes('ROLE_TEACHER') || 
          user.roles.includes('ROLE_ADMIN')
        );
        this.course = course;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.message = 'Erreur lors du chargement des données.';
        this.success = false;
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    console.log('Updating UE:', this.ueId, this.course);
    
    this.courseService.updateCourse(this.ueId, this.course).subscribe({
      next: (updatedCourse: Course) => {
        console.log('Course updated successfully:', updatedCourse);
        this.message = 'UE modifiée avec succès!';
        this.success = true;
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 1500);
      },
      error: (error: any) => {
        console.error('Error updating course:', error);
        this.message = 'Erreur lors de la modification de l\'UE';
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
