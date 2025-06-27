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
}

export interface Inscription {
  id: string;
  course_id: string;
  user_id: string;
  enrollment_date: string;
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
