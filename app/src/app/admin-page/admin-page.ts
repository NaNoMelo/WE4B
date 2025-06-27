import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { CourseService } from '../services/course.service';
import { User, Course } from '../models/api.models';

@Component({
  selector: 'app-admin-page',
  imports: [CommonModule],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.scss'
})
export class AdminPage implements OnInit {
  protected activeTab: string = 'users';
  protected showModal: boolean = false;
  protected deleteType: string = '';
  protected deleteId: string = '';
  protected isLoading: boolean = true;

  protected users: User[] = [];
  protected courses: Course[] = [];

  // Role labels in French
  protected roleLabels: { [key: string]: string } = {
    'ROLE_ADMIN': 'Administrateur',
    'ROLE_TEACHER': 'Enseignant',
    'ROLE_USER': 'Étudiant'
  };

  constructor(
    private router: Router,
    private userService: UserService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadCourses();
  }

  private loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.checkLoadingState();
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
        this.checkLoadingState();
      }
    });
  }

  private loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (courses: Course[]) => {
        this.courses = courses;
        this.checkLoadingState();
      },
      error: (error: any) => {
        console.error('Error loading courses:', error);
        this.checkLoadingState();
      }
    });
  }

  private checkLoadingState(): void {
    if (this.users.length >= 0 && this.courses.length >= 0) {
      this.isLoading = false;
    }
  }

  selectTab(tab: string): void {
    this.activeTab = tab;
  }

  onCreateUser(): void {
    console.log('Creating new user...');
    this.router.navigate(['/create-user']);
  }

  onCreateUe(): void {
    console.log('Creating new UE...');
    this.router.navigate(['/create-ue']);
  }

  onEditUser(id: string): void {
    console.log('Editing user with ID:', id);
    this.router.navigate(['/edit-user', id]);
  }

  onEditUe(id: string): void {
    console.log('Editing UE with ID:', id);
    this.router.navigate(['/edit-ue', id]);
  }

  editUser(id: string): void {
    this.router.navigate(['/edit-user', id]);
  }

  createUser(): void {
    this.router.navigate(['/create-user']);
  }

  editUe(id: string): void {
    this.router.navigate(['/edit-ue', id]);
  }

  createUe(): void {
    this.router.navigate(['/create-ue']);
  }

  confirmDelete(type: string, id: string): void {
    this.deleteType = type;
    this.deleteId = id;
    this.showModal = true;
  }

  confirmDeleteUser(id: string): void {
    this.deleteType = 'user';
    this.deleteId = id;
    this.showModal = true;
  }

  confirmDeleteUe(id: string): void {
    this.deleteType = 'ue';
    this.deleteId = id;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetDeleteState();
  }

  private resetDeleteState(): void {
    this.deleteType = '';
    this.deleteId = '';
  }

  onDeleteConfirmed(): void {
    if (this.deleteType === 'user') {
      this.userService.deleteUser(this.deleteId).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== this.deleteId);
          console.log('User deleted with ID:', this.deleteId);
          this.closeModal();
        },
        error: (error: any) => {
          console.error('Error deleting user:', error);
        }
      });
    } else if (this.deleteType === 'ue') {
      this.courseService.deleteCourse(this.deleteId).subscribe({
        next: () => {
          this.courses = this.courses.filter(course => course.id !== this.deleteId);
          console.log('Course deleted with ID:', this.deleteId);
          this.closeModal();
        },
        error: (error: any) => {
          console.error('Error deleting course:', error);
        }
      });
    }
  }

  getRoleLabels(roles: string[]): string {
    return roles.map(role => this.roleLabels[role] || role).join(', ');
  }
}
