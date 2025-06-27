import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { PostService } from '../services/post.service';
import { CourseService } from '../services/course.service';
import { FileService } from '../services/file.service';
import { Post, Course } from '../models/api.models';

@Component({
  selector: 'app-post-edit',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './post-edit.html',
  styleUrl: './post-edit.scss'
})
export class PostEdit implements OnInit {
  protected postId: string = '';
  protected courseId: string = '';
  protected course: Course | null = null;
  protected isNewPost: boolean = false;
  protected isEditing: boolean = false;
  protected postType: string = 'text';
  protected fileName: string = '';
  protected isLoading: boolean = false;
  protected attachedFile: any = null; // Store file information

  protected post: Partial<Post> = {
    title: '',
    description: '',
    importance: 'normal',
    pinned: false
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private postService: PostService,
    private courseService: CourseService,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id') || '';
    this.courseId = this.route.snapshot.queryParamMap.get('courseId') || '';
    this.isNewPost = this.postId === '' || this.postId === '0';
    this.isEditing = !this.isNewPost;
    
    this.loadCourseData();
    
    if (this.isEditing) {
      this.loadPostData();
    }
  }

  private loadCourseData(): void {
    if (this.courseId) {
      this.courseService.getCourseById(this.courseId).subscribe({
        next: (course: Course) => {
          this.course = course;
        },
        error: (error: any) => {
          console.error('Error loading course data:', error);
        }
      });
    }
  }

  private loadPostData(): void {
    this.isLoading = true;
    this.postService.getPostById(this.postId).subscribe({
      next: (post: Post) => {
        this.post = {
          title: post.title,
          description: post.description,
          importance: post.importance,
          pinned: post.pinned
        };
        this.courseId = post.course_id;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading post data:', error);
        this.isLoading = false;
      }
    });
  }

  setPostType(type: string): void {
    this.postType = type;
  }

  onSubmitText(): void {
    console.log('Submitting text post:', this.post);
    
    if (this.isNewPost) {
      this.postService.createPost(this.courseId, this.post as Post).subscribe({
        next: (createdPost: Post) => {
          console.log('Post created successfully:', createdPost);
          this.navigateBack();
        },
        error: (error: any) => {
          console.error('Error creating post:', error);
        }
      });
    } else {
      this.postService.updatePost(this.postId, this.post as Post).subscribe({
        next: (updatedPost: Post) => {
          console.log('Post updated successfully:', updatedPost);
          this.navigateBack();
        },
        error: (error: any) => {
          console.error('Error updating post:', error);
        }
      });
    }
  }

  onSubmitFile(): void {
    console.log('Submitting file post:', this.post);
    // For file posts, you would first upload the file, then create the post
    // This is a simplified implementation
    this.onSubmitText();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.attachedFile = {
        name: file.name.substring(0, file.name.lastIndexOf('.')),
        extension: file.name.substring(file.name.lastIndexOf('.') + 1)
      };
      // Handle file upload using FileService
      this.fileService.uploadFile(file).subscribe({
        next: (uploadedFile: any) => {
          console.log('File uploaded successfully:', uploadedFile);
        },
        error: (error: any) => {
          console.error('Error uploading file:', error);
        }
      });
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.fileName = file.name;
      this.attachedFile = file; // Store the file information
      // Handle file upload using FileService
      this.fileService.uploadFile(file).subscribe({
        next: (uploadedFile: any) => {
          console.log('File uploaded successfully:', uploadedFile);
        },
        error: (error: any) => {
          console.error('Error uploading file:', error);
        }
      });
    }
  }

  getDownloadUrl(): string {
    return '#'; // Placeholder URL
  }

  onSubmit(): void {
    if (this.postType === 'text') {
      this.onSubmitText();
    } else {
      this.onSubmitFile();
    }
  }

  onCancel(): void {
    this.navigateBack();
  }

  private navigateBack(): void {
    this.router.navigate(['/course', this.courseId]);
  }
}
