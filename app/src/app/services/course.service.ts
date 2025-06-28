import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { Course, User } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class CourseService extends ApiService {

  // GET /courses - List all courses
  getAllCourses(): Observable<Course[]> {
    // Always use mock data for development
    const fakeCourses: Course[] = [
      {
        id: '1',
        code: 'MT41',
        name: 'Mathématiques Appliquées',
        description: 'Cours de mathématiques avancées pour ingénieurs',
        creation_date: '2025-01-15T10:00:00Z',
        user_responsible_id: '2'
      },
      {
        id: '2',
        code: 'IF23',
        name: 'Programmation Orientée Objet',
        description: 'Introduction à la programmation orientée objet avec Java',
        creation_date: '2025-01-16T09:00:00Z',
        user_responsible_id: '3'
      },
      {
        id: '3',
        code: 'PH15',
        name: 'Physique Quantique',
        description: 'Principes fondamentaux de la physique quantique',
        creation_date: '2025-01-17T14:00:00Z',
        user_responsible_id: '2'
      },
      {
        id: '4',
        code: 'EL30',
        name: 'Électronique Numérique',
        description: 'Conception et analyse de circuits électroniques numériques',
        creation_date: '2025-01-18T11:00:00Z',
        user_responsible_id: '4'
      },
      {
        id: '5',
        code: 'GE25',
        name: 'Gestion de Projet',
        description: 'Méthodologies et outils de gestion de projet',
        creation_date: '2025-01-19T15:00:00Z',
        user_responsible_id: '4'
      }
    ];
    return of(fakeCourses);
  }

  // GET /courses/{id} - Get course by ID
  getCourseById(id: string): Observable<Course> {
    // Fake data for development
    const fakeCourse: Course = {
      id: id,
      code: 'IF23',
      name: 'Programmation Orientée Objet',
      description: 'Introduction à la programmation orientée objet avec Java. Ce cours couvre les concepts fondamentaux de la POO.',
      creation_date: '2025-01-16T09:00:00Z',
      user_responsible_id: '3'
    };
    return of(fakeCourse);
    // Real implementation: return this.get<Course>(`/courses/${id}`);
  }

  // POST /courses - Create a course
  createCourse(courseData: Omit<Course, 'id' | 'creation_date'>): Observable<Course> {
    // Mock response for development
    console.log('Creating course:', courseData);
    const newCourse: Course = {
      id: Date.now().toString(),
      ...courseData,
      creation_date: new Date().toISOString()
    };
    return of(newCourse);
  }

  // PUT /courses/{id} - Update course
  updateCourse(id: string, courseData: Partial<Course>): Observable<Course> {
    // Mock response for development
    console.log('Updating course:', id, courseData);
    const updatedCourse: Course = {
      id: id,
      code: courseData.code || 'UPD01',
      name: courseData.name || 'Updated Course',
      description: courseData.description || 'Updated description',
      creation_date: '2025-01-15T10:00:00Z',
      user_responsible_id: courseData.user_responsible_id || '1'
    };
    return of(updatedCourse);
  }

  // DELETE /courses/{id} - Delete course
  deleteCourse(id: string): Observable<any> {
    // Empty function for now - will be implemented when backend is ready
    console.log('Deleting course:', id);
    return of({ message: 'Course deleted successfully' });
    // Real implementation: return this.delete(`/courses/${id}`);
  }

  // POST /courses/{id}/enroll - Enroll current user in a course
  enrollInCourse(courseId: string): Observable<any> {
    // Empty function for now - will be implemented when backend is ready
    console.log('Enrolling in course:', courseId);
    return of({ message: 'Enrolled successfully' });
    // Real implementation: return this.post(`/courses/${courseId}/enroll`, {});
  }

  // DELETE /courses/{id}/unenroll - Unenroll current user from course
  unenrollFromCourse(courseId: string): Observable<any> {
    // Empty function for now - will be implemented when backend is ready
    console.log('Unenrolling from course:', courseId);
    return of({ message: 'Unenrolled successfully' });
    // Real implementation: return this.delete(`/courses/${courseId}/unenroll`);
  }
  getImageUrl(imageFileName: string): string {
    return `${this.baseUrl}/uploads/${imageFileName}`;
  }
}
