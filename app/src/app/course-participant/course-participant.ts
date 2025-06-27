import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CourseService } from '../services/course.service';
import { UserService } from '../services/user.service';
import { Course, User } from '../models/api.models';

@Component({
  selector: 'app-course-participant',
  imports: [CommonModule, RouterModule],
  templateUrl: './course-participant.html',
  styleUrl: './course-participant.scss'
})
export class CourseParticipant implements OnInit {
  protected courseId: string = '';
  protected course: Course | null = null;
  protected professors: User[] = [];
  protected students: User[] = [];
  protected isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    this.loadCourseData();
    this.loadParticipants();
  }

  private loadCourseData(): void {
    if (this.courseId) {
      this.courseService.getCourseById(this.courseId).subscribe({
        next: (course: Course) => {
          this.course = course;
          this.checkLoadingState();
        },
        error: (error: any) => {
          console.error('Error loading course data:', error);
          this.checkLoadingState();
        }
      });
    }
  }

  private loadParticipants(): void {
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        // Separate users by roles
        this.professors = users.filter(user => 
          user.roles.includes('ROLE_TEACHER') || user.roles.includes('ROLE_ADMIN')
        );
        this.students = users.filter(user => 
          user.roles.includes('ROLE_USER') && !user.roles.includes('ROLE_TEACHER')
        );
        this.checkLoadingState();
      },
      error: (error: any) => {
        console.error('Error loading participants:', error);
        this.checkLoadingState();
      }
    });
  }

  private checkLoadingState(): void {
    if (this.course !== null && this.professors.length >= 0 && this.students.length >= 0) {
      this.isLoading = false;
    }
  }
}
