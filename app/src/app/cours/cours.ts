import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CourseService } from '../services/course.service';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { LogService } from '../services/log.service';
import { FileService } from '../services/file.service';
import { Course, Post, User, FileModel } from '../models/api.models';

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
  protected fileNames: { [fileId: number]: string } = {};
  protected fileMetadataCache: { [fileId: number]: FileModel } = {};
  protected userCache: { [userId: string]: User } = {}; // Cache for user data

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private postService: PostService,
    private authService: AuthService,
    private userService: UserService,
    private logService: LogService,
    private fileService: FileService
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
          
          // Log course access
          if (this.currentUser) {
            this.logService.log(`Accès au cours "${course.name}" par ${this.currentUser.first_name} ${this.currentUser.name}`, this.currentUser.id);
          }
        },
        error: (error: any) => {
          console.error('Error loading course data:', error);
          this.isLoading = false;
        }
      });
    }
  }

  private loadPosts(): void {
    this.postService.getPostsByCourse(this.courseId).subscribe({
      next: (posts: Post[]) => {
        this.posts = posts;
        
        // Pre-load user data for all post authors
        posts.forEach(post => {
          if (post.author_id) {
            this.preloadUserData(post.author_id);
          }
        });
        
        // Load file names and metadata for file posts
        this.loadFileNames();
      },
      error: (error: any) => {
        console.error('Error loading posts:', error);
      }
    });
  }

  // Pre-load user data for caching
  private preloadUserData(userId: string): void {
    if (!this.userCache[userId]) {
      this.userService.getUserById(userId).subscribe({
        next: (user: User) => {
          this.userCache[userId] = user;
        },
        error: (error: any) => {
          console.error('Error loading user data for:', userId, error);
        }
      });
    }
  }

  private loadFileNames(): void {
    // Load file names and metadata for all file posts
    const filePosts = this.posts.filter(post => post.type === 'file' && post.file_id);
    filePosts.forEach(post => {
      if (post.file_id && !this.fileNames[post.file_id]) {
        this.fileService.getFileById(post.file_id).subscribe({
          next: (file) => {
            this.fileNames[post.file_id!] = `${file.name}.${file.extension}`;
            this.fileMetadataCache[post.file_id!] = file;
          },
          error: (error) => {
            console.error('Error loading file:', error);
            this.fileNames[post.file_id!] = 'Erreur de chargement';
          }
        });
      }
    });
  }


  // Public method to refresh posts (can be called after editing)
  refreshPosts(): void {
    this.loadPosts();
  }

  private checkModifyPermissions(): void {
    if (this.currentUser && this.course) {
      // Check if current user is the course responsible or has admin role
      this.canModify = this.currentUser.id === this.course.user_responsible_id || 
                      this.currentUser.roles.includes('ROLE_TEACHER');
    }
  }

  protected isAdmin(): boolean {
    // Check if user is a pure admin (has ROLE_ADMIN but not ROLE_TEACHER)
    // Admin teachers should still be able to access assignments
    return this.currentUser?.roles?.includes('ROLE_ADMIN') && 
           !this.currentUser?.roles?.includes('ROLE_TEACHER') || false;
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
        // Remove the deleted post and maintain sorting
        this.posts = this.posts.filter(post => post.id !== postId);
        console.log('Post deleted successfully');
        
        // Log post deletion
        if (this.currentUser) {
          this.logService.log(`Suppression d'un post par ${this.currentUser.first_name} ${this.currentUser.name} dans le cours ${this.course?.name || this.courseId}`, this.currentUser.id);
        }
      },
      error: (error: any) => {
        console.error('Error deleting post:', error);
      }
    });
  }

  // Get user name from user ID using API
  getAuthorName(userId: string): string {
    // Check cache first
    if (this.userCache[userId]) {
      const user = this.userCache[userId];
      return `${user.first_name} ${user.name}`;
    }
    
    // Load user data if not in cache
    this.userService.getUserById(userId).subscribe({
      next: (user: User) => {
        this.userCache[userId] = user;
      },
      error: (error: any) => {
        console.error('Error loading user:', userId, error);
      }
    });
    
    return 'Chargement...'; // Temporary placeholder while loading
  }

  // Get file name for file posts
  getFileName(fileId: number | undefined): string {
    if (!fileId) return 'Fichier inconnu';
    return this.fileNames[fileId] || 'Chargement...';
  }

  // Get file metadata for file posts
  getFileMetadata(fileId: number | undefined): FileModel | null {
    if (!fileId) return null;
    return this.fileMetadataCache[fileId] || null;
  }

  // Format file size in human readable format
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  onDownload(fileId: number | undefined): void {
    if (!fileId) {
      console.error('No file ID provided for download');
      return;
    }

    // Get file information first
    this.fileService.getFileById(fileId).subscribe({
      next: (file) => {
        const fileName = `${file.name}.${file.extension}`;
        console.log('Starting download for file:', fileName);
        
        // Log the download action
        if (this.currentUser) {
          this.logService.log(`Téléchargement du fichier "${fileName}" par ${this.currentUser.first_name} ${this.currentUser.name}`, this.currentUser.id);
        }
        
        // Use the download route
        this.fileService.downloadFile(fileId).subscribe({
          next: (blob: Blob) => {
            // Create download link and trigger download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            console.log('File downloaded successfully:', fileName);
          },
          error: (error) => {
            console.error('Error downloading file:', error);
            alert('Erreur lors du téléchargement du fichier');
          }
        });
      },
      error: (error) => {
        console.error('Error getting file information:', error);
        alert('Erreur lors de la récupération des informations du fichier');
      }
    });
  }
}
