import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { CourseService } from '../services/course.service';
import { User, Course } from '../models/api.models';

@Component({
  selector: 'app-edit-user',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.scss'
})
export class EditUser implements OnInit {
  protected userId: string = '';
  protected message: string = '';
  protected success: boolean = false;
  protected loading: boolean = false;
  protected error: string = '';
  
  protected user: User = {
    id: '',
    email: '',
    name: '',
    first_name: '',
    roles: []
  };
  
  // Password fields (separate from user object)
  protected newPassword: string = '';
  protected confirmPassword: string = '';
  
  // Available roles
  protected availableRoles: string[] = ['ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_USER'];
  
  protected courses: Course[] = [];
  protected userCourseIds: string[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    if (this.userId) {
      this.loadUserData();
      this.loadCourses();
    }
  }

  private loadUserData(): void {
    this.loading = true;
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
        // Mock user course associations for development
        this.userCourseIds = ['1']; // Example: user is associated with course 1
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des données utilisateur';
        this.loading = false;
        console.error('Error loading user:', error);
      }
    });
  }

  private loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
      }
    });
  }

  onSubmit(): void {
    // Validate password fields if they're filled
    if (this.newPassword && this.newPassword !== this.confirmPassword) {
      this.message = 'Les mots de passe ne correspondent pas';
      this.success = false;
      return;
    }

    // Prepare update data
    const updateData: Partial<User> = {
      email: this.user.email,
      name: this.user.name,
      first_name: this.user.first_name,
      roles: this.user.roles
    };

    console.log('Updating user:', this.userId, updateData);
    console.log('Associated courses:', this.userCourseIds);
    console.log('New password:', this.newPassword ? '[SET]' : '[NOT SET]');
    
    this.loading = true;
    this.userService.updateUser(this.userId, updateData).subscribe({
      next: () => {
        this.message = 'Utilisateur modifié avec succès!';
        this.success = true;
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 1500);
      },
      error: (error) => {
        this.message = 'Erreur lors de la modification de l\'utilisateur';
        this.success = false;
        this.loading = false;
        console.error('Error updating user:', error);
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
