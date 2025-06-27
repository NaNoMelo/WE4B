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
  type?: string; // 'text' or 'file'
  file_id?: string; // File ID when type is 'file'
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
  id: string;
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
