import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AssignmentService } from '../services/assignment.service';
import { FileService } from '../services/file.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { LogService } from '../services/log.service';
import { Assignment, AssignmentSubmission, User, FileModel } from '../models/api.models';

@Component({
  selector: 'app-assignment',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './assignment.html',
  styleUrl: './assignment.scss'
})
export class AssignmentComponent implements OnInit {
  protected assignmentId: number = 0;
  protected assignment: Assignment | null = null;
  protected currentUser: User | null = null;
  protected mySubmission: AssignmentSubmission | null = null;
  protected submissions: AssignmentSubmission[] = [];
  protected isLoading: boolean = true;
  protected isTeacher: boolean = false;
  protected selectedFile: File | null = null;
  protected isSubmitting: boolean = false;
  protected gradingSubmission: string | null = null;
  protected gradeForm: { [submissionId: string]: { score: number; feedback: string } } = {};
  protected userCache: { [userId: string]: User } = {}; // Cache for user data

  constructor(
    private route: ActivatedRoute,
    private assignmentService: AssignmentService,
    private fileService: FileService,
    private authService: AuthService,
    private userService: UserService,
    private logService: LogService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.assignmentId = idParam ? parseInt(idParam, 10) : 0;
    this.loadCurrentUserData();
    this.loadAssignmentData();
  }

  private loadCurrentUserData(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.currentUser = user;
        this.isTeacher = user.roles.includes('ROLE_TEACHER') || user.roles.includes('ROLE_ADMIN');
        this.loadMySubmission();
        if (this.isTeacher) {
          this.loadSubmissions();
        }
      },
      error: (error: any) => {
        console.error('Error loading user data:', error);
      }
    });
  }

  private loadAssignmentData(): void {
    this.assignmentService.getAssignmentById(this.assignmentId).subscribe({
      next: (assignment: Assignment) => {
        this.assignment = assignment;
        this.isLoading = false;
        
        // Pre-load creator user data
        if (assignment.created_by) {
          this.preloadUserData(assignment.created_by);
        }
      },
      error: (error: any) => {
        console.error('Error loading assignment:', error);
        this.isLoading = false;
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

  private loadMySubmission(): void {
    if (this.assignmentId > 0 && !this.isTeacher) {
      this.assignmentService.getMySubmission(this.assignmentId).subscribe({
        next: (submission: AssignmentSubmission | null) => {
          this.mySubmission = submission;
        },
        error: (error: any) => {
          console.error('Error loading my submission:', error);
        }
      });
    }
  }

  private loadSubmissions(): void {
    if (this.assignmentId > 0 && this.isTeacher) {
      this.assignmentService.getAssignmentSubmissions(this.assignmentId).subscribe({
        next: (submissions: AssignmentSubmission[]) => {
          this.submissions = submissions;
          
          // Pre-load user data for all students who submitted
          submissions.forEach(submission => {
            if (submission.student_id) {
              this.preloadUserData(submission.student_id);
            }
          });
        },
        error: (error: any) => {
          console.error('Error loading submissions:', error);
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer!.dropEffect = 'copy';
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
      this.selectedFile = files[0];
    }
  }

  onSubmitAssignment(): void {
    if (!this.selectedFile || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    // First upload the file
    this.fileService.uploadFile(this.selectedFile).subscribe({
      next: (uploadedFile: FileModel) => {
        // Then submit the assignment with the file ID
        this.assignmentService.submitAssignment(this.assignmentId, uploadedFile.id).subscribe({
          next: (submission: AssignmentSubmission) => {
            this.mySubmission = submission;
            this.isSubmitting = false;
            this.selectedFile = null;
            
            // Log the submission
            if (this.currentUser && this.assignment) {
              this.logService.log(`Remise du devoir "${this.assignment.title}" par ${this.currentUser.first_name} ${this.currentUser.name}`, this.currentUser.id);
            }
            
            alert('Devoir soumis avec succès !');
          },
          error: (error: any) => {
            console.error('Error submitting assignment:', error);
            this.isSubmitting = false;
            alert('Erreur lors de la soumission du devoir');
          }
        });
      },
      error: (error: any) => {
        console.error('Error uploading file:', error);
        this.isSubmitting = false;
        alert('Erreur lors de l\'upload du fichier');
      }
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  getDaysUntilDue(): number {
    if (!this.assignment) return 0;
    
    const dueDate = new Date(this.assignment.due_date);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  isOverdue(): boolean {
    return this.getDaysUntilDue() < 0;
  }

  isSubmissionLate(submission: AssignmentSubmission): boolean {
    if (!this.assignment) return false;
    
    const submittedDate = new Date(submission.submitted_date);
    const dueDate = new Date(this.assignment.due_date);
    
    return submittedDate > dueDate;
  }

  // Grading methods
  startGrading(submission: AssignmentSubmission): void {
    this.gradingSubmission = submission.id;
    if (!this.gradeForm[submission.id]) {
      this.gradeForm[submission.id] = {
        score: submission.score || 0,
        feedback: submission.feedback || ''
      };
    }
  }

  cancelGrading(): void {
    this.gradingSubmission = null;
  }

  submitGrade(submission: AssignmentSubmission): void {
    if (!this.gradingSubmission || !this.assignment) return;

    const gradeData = this.gradeForm[submission.id];
    if (gradeData.score < 0 || gradeData.score > (this.assignment.max_score || 100)) {
      alert(`La note doit être entre 0 et ${this.assignment.max_score || 100}`);
      return;
    }

    this.assignmentService.gradeSubmission(
      this.assignmentId, 
      submission.id, 
      gradeData.score, 
      gradeData.feedback
    ).subscribe({
      next: (updatedSubmission: AssignmentSubmission) => {
        // Update the submission in the list
        const index = this.submissions.findIndex(s => s.id === submission.id);
        if (index !== -1) {
          this.submissions[index] = updatedSubmission;
        }
        
        // Log the grading action
        if (this.currentUser && this.assignment) {
          this.logService.log(
            `Note attribuée (${gradeData.score}/${this.assignment.max_score}) pour le devoir "${this.assignment.title}" - Étudiant ${submission.student_id}`, 
            this.currentUser.id
          );
        }
        
        this.gradingSubmission = null;
        alert('Note enregistrée avec succès !');
      },
      error: (error: any) => {
        console.error('Error grading submission:', error);
        alert('Erreur lors de l\'enregistrement de la note');
      }
    });
  }

  getStudentName(studentId: string): string {
    // Use the same getUserName method for consistency
    return this.getUserName(studentId);
  }

  downloadSubmission(submission: AssignmentSubmission): void {
    if (submission.file_id) {
      this.fileService.downloadFile(submission.file_id).subscribe({
        next: (blob: Blob) => {
          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `submission_${submission.student_id}_${submission.id}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        },
        error: (error: any) => {
          console.error('Error downloading submission:', error);
          alert('Erreur lors du téléchargement');
        }
      });
    }
  }

  downloadMySubmission(): void {
    if (!this.mySubmission?.file_id) {
      console.warn('No file to download');
      return;
    }

    this.fileService.downloadFile(this.mySubmission.file_id).subscribe({
      next: (blob: Blob) => {
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.mySubmission?.file_id ? this.getFileName(this.mySubmission.file_id) : 'download.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (error: any) => {
        console.error('Error downloading my submission:', error);
        alert('Erreur lors du téléchargement du fichier.');
      }
    });
  }

  // Add notification checking
  hasNewUpdate(): boolean {
    if (!this.mySubmission) return false;
    
    // Check if submission was recently graded (within last 24 hours)
    if (this.mySubmission.status === 'graded' && this.mySubmission.score !== undefined) {
      const now = new Date();
      const submittedDate = new Date(this.mySubmission.submitted_date);
      const hoursSinceSubmission = (now.getTime() - submittedDate.getTime()) / (1000 * 60 * 60);
      
      // Mock: assume grading happened recently if submitted more than 2 hours ago but less than 24 hours
      return hoursSinceSubmission > 2 && hoursSinceSubmission < 24;
    }
    
    return false;
  }

  getUpdateMessage(): string {
    if (this.mySubmission?.status === 'graded') {
      return 'Votre devoir a été corrigé !';
    }
    return '';
  }

  markUpdateAsRead(): void {
    // In a real app, this would make an API call to mark the notification as read
    console.log('Marking update as read for assignment:', this.assignmentId);
    // For now, we can simulate by not showing the notification after a certain time
  }

  getGradingDate(): string {
    if (!this.mySubmission || this.mySubmission.status !== 'graded') {
      return '';
    }
    
    // Mock: assume grading happened 1 hour after submission for demo
    const submittedDate = new Date(this.mySubmission.submitted_date);
    const gradedDate = new Date(submittedDate.getTime() + (1 * 60 * 60 * 1000)); // 1 hour later
    return gradedDate.toISOString();
  }

  // Helper methods for safe score calculations
  getScorePercentage(): number {
    if (!this.mySubmission?.score || !this.assignment?.max_score) {
      return 0;
    }
    return (this.mySubmission.score / this.assignment.max_score) * 100;
  }

  // Remove selected file
  removeSelectedFile(event: Event): void {
    event.stopPropagation();
    this.selectedFile = null;
    console.log('Selected file removed');
  }

  // Get filename for download
  getFileName(fileId: number): string {
    // In a real app, this would come from the file service or be stored with the submission
    const fileExtensions = ['.pdf', '.doc', '.docx', '.txt', '.zip'];
    const randomExt = fileExtensions[fileId % fileExtensions.length];
    return `submission_${fileId}${randomExt}`;
  }

  // Get user name from user ID using API
  getUserName(userId: string): string {
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

  startModifySubmission(): void {
    if (this.mySubmission && this.mySubmission.status !== 'graded') {
      // Allow modification if not graded yet
      // Reset the submission to allow new file upload
      this.mySubmission = null;
      this.selectedFile = null;
      
      // Show notification
      alert('Vous pouvez maintenant modifier votre soumission. Votre ancienne soumission sera remplacée.');
    }
  }
}
