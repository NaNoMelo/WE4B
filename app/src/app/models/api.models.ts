// API Models based on OpenAPI specification

export interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  first_name: string;
  roles: string[];
}

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  creation_date: string;
  user_responsible_id: string;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  date_time: string;
  pinned: boolean;
  importance: string;
  author_id: string;
  course_id: string;
  type?: string; // 'text', 'file', or 'assignment'
  file_id?: number; // File ID when type is 'file'
  assignment_id?: number; // Assignment ID when type is 'assignment'
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  date_time: string;
  user_id: string;
  course_id: string;
}

export interface FileModel {
  id: number;
  name: string;
  extension: string;
  size?: number; // File size in bytes
  mime_type?: string; // MIME type of the file
  upload_date?: string; // ISO date string when file was uploaded
  uploaded_by?: string; // User ID who uploaded the file
}

export interface Inscription {
  id: string;
  course_id: string;
  user_id: string;
  enrollment_date: string;
}

export interface Log {
  id: string;
  timestamp: string;
  description: string;
  user_id?: string; // Optional user ID for filtering logs by user
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  due_date: string;
  max_score?: number;
  course_id: string;
  created_by: string;
  created_date: string;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: number;
  student_id: string;
  file_id?: number;
  submitted_date: string;
  score?: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'late';
}

// Request/Response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  first_name: string;
  password: string;
  roles: string[];
}

export interface LoginResponse {
  token: string;
  user: User;
}
