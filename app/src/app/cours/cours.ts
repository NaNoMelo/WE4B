import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CourseService } from '../services/course.service';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
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
  protected fileNames: { [fileId: string]: string } = {};
  protected fileMetadataCache: { [fileId: string]: FileModel } = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private postService: PostService,
    private authService: AuthService,
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
    if (this.courseId) {
      this.postService.getPostsByCourse(this.courseId).subscribe({
        next: (posts: Post[]) => {
          this.posts = this.sortPosts(posts);
          this.loadFileNames();
        },
        error: (error: any) => {
          console.error('Error loading posts:', error);
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

  private sortPosts(posts: Post[]): Post[] {
    return posts.sort((a, b) => {
      // First, sort by pinned status (pinned posts come first)
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      
      // If both have same pinned status, sort by date (most recent first)
      const dateA = new Date(a.date_time).getTime();
      const dateB = new Date(b.date_time).getTime();
      return dateB - dateA; // Descending order (most recent first)
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

  // Get file name for file posts
  getFileName(fileId: string | undefined): string {
    if (!fileId) return 'Fichier inconnu';
    return this.fileNames[fileId] || 'Chargement...';
  }

  // Get file metadata for file posts
  getFileMetadata(fileId: string | undefined): FileModel | null {
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

  onDownload(fileId: string | undefined): void {
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
