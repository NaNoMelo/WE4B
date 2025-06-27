import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CourseService } from '../services/course.service';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { Course, Post, User } from '../models/api.models';

@Component({
  selector: 'app-cours',
  imports: [CommonModule, RouterModule],
  templateUrl: './cours.html',
  styleUrl: './cours.scss'
})
export class Cours implements OnInit {
  protected courseId: string = '';
  protected course: Course | null = null;
  protected currentUser: User | null = null;
  protected canModify: boolean = false;
  protected posts: Post[] = [];
  protected isLoading: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    this.loadUserData();
    this.loadCourseData();
    this.loadPosts();
  }

  private loadUserData(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.currentUser = user;
        this.checkModifyPermissions();
      },
      error: (error: any) => {
        console.error('Error loading user data:', error);
      }
    });
  }

  private loadCourseData(): void {
    if (this.courseId) {
      this.courseService.getCourseById(this.courseId).subscribe({
        next: (course: Course) => {
          this.course = course;
          this.checkModifyPermissions();
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error loading course data:', error);
          this.isLoading = false;
        }
      });
    }
  }

  private loadPosts(): void {
    if (this.courseId) {
      this.postService.getPostsByCourse(this.courseId).subscribe({
        next: (posts: Post[]) => {
          this.posts = posts;
        },
        error: (error: any) => {
          console.error('Error loading posts:', error);
        }
      });
    }
  }

  private checkModifyPermissions(): void {
    if (this.currentUser && this.course) {
      // Check if current user is the course responsible or has admin role
      this.canModify = this.currentUser.id === this.course.user_responsible_id || 
                      this.currentUser.roles.includes('ROLE_ADMIN');
    }
  }

  onDeleteCourse(): void {
    if (this.course) {
      console.log('Deleting course:', this.course.id);
      this.courseService.deleteCourse(this.course.id).subscribe({
        next: () => {
          console.log('Course deleted successfully');
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
          console.error('Error deleting course:', error);
        }
      });
    }
  }

  onNewPost(): void {
    console.log('Creating new post...');
    this.router.navigate(['/post-edit', 0], { queryParams: { courseId: this.courseId } });
  }

  onEditPost(postId: string): void {
    console.log('Editing post:', postId);
    this.router.navigate(['/post-edit', postId], { queryParams: { courseId: this.courseId } });
  }

  onDeletePost(postId: string): void {
    console.log('Deleting post:', postId);
    this.postService.deletePost(postId).subscribe({
      next: () => {
        this.posts = this.posts.filter(post => post.id !== postId);
        console.log('Post deleted successfully');
      },
      error: (error: any) => {
        console.error('Error deleting post:', error);
      }
    });
  }

  onDownload(postId: string): void {
    // For now, just log the action since file downloading will depend on backend implementation
    console.log('Downloading file for post:', postId);
    // Future implementation could use FileService to handle downloads
  }
}
