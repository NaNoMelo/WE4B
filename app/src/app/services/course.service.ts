import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { Course, User } from '../models/api.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService extends ApiService {

  // GET /courses - List all courses
  getAllCourses(): Observable<Course[]> {
    if (environment.useMockData){// Always use mock data for development
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

    return this.get<Course[]>('/courses');
  }

  // GET /courses/{id} - Get course by ID
  getCourseById(id: string): Observable<Course> {
    if (environment.useMockData){// Fake data for development
      const fakeCourse: Course = {
        id: id,
        code: 'IF23',
        name: 'Programmation Orientée Objet',
        description: 'Introduction à la programmation orientée objet avec Java. Ce cours couvre les concepts fondamentaux de la POO.',
        creation_date: '2025-01-16T09:00:00Z',
        user_responsible_id: '3'
      };
      return of(fakeCourse);
    }

    return this.get<Course>(`/courses/${id}`);
  }

  // POST /courses - Create a course
  createCourse(courseData: Omit<Course, 'id' | 'creation_date'>): Observable<Course> {
    if (environment.useMockData){// Mock response for development
      console.log('Creating course:', courseData);
      const newCourse: Course = {
        id: Date.now().toString(),
        ...courseData,
        creation_date: new Date().toISOString()
      };
      return of(newCourse);
    }

    return this.post<Course>('/courses', courseData);
  }

  // PUT /courses/{id} - Update course
  updateCourse(id: string, courseData: Partial<Course>): Observable<Course> {
    if (environment.useMockData){// Mock response for development
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

    return this.put<Course>(`/courses/${id}`, courseData);
  }

  // DELETE /courses/{id} - Delete course
  deleteCourse(id: string): Observable<any> {
    if (environment.useMockData){// Empty function for Mock data
      console.log('Deleting course:', id);
      return of({ message: 'Course deleted successfully' });
    }

    return this.delete(`/courses/${id}`);
  }

  // POST /courses/{id}/enroll - Enroll current user in a course
  enrollInCourse(courseId: string): Observable<any> {
    if (environment.useMockData) {
      // Empty function for Mock data
      console.log('Enrolling in course:', courseId);
      return of({ message: 'Enrolled successfully' });
    }
    return this.post(`/courses/${courseId}/enroll`, {});
  }

  // DELETE /courses/{id}/unenroll - Unenroll current user from course
  unenrollFromCourse(courseId: string): Observable<any> {
    if (environment.useMockData){// Empty function for now - will be implemented when backend is ready
      console.log('Unenrolling from course:', courseId);
      return of({ message: 'Unenrolled successfully' });
    }

    return this.delete(`/courses/${courseId}/unenroll`);
  }

  getImageUrl(imageFileName: string): string {
    return `${this.baseUrl}/uploads/${imageFileName}`;
  }
}
