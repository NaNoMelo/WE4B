import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { Inscription } from '../models/api.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InscriptionService extends ApiService {

  // GET /inscriptions - Get all inscriptions (not in swagger but likely needed)
  getAllInscriptions(): Observable<Inscription[]> {
    if (environment.useMockData){  // Fake data for development
      const fakeInscriptions: Inscription[] = [
        {
          id: '1',
          course_id: '1',
          user_id: '1',
          enrollment_date: '2025-01-15T10:00:00Z'
        },
        {
          id: '2',
          course_id: '2',
          user_id: '1',
          enrollment_date: '2025-01-16T11:00:00Z'
        },
        {
          id: '3',
          course_id: '1',
          user_id: '2',
          enrollment_date: '2025-01-17T09:00:00Z'
        }
      ];
      return of(fakeInscriptions);
    }

    return this.get<Inscription[]>('/inscriptions');
  }

  // GET /courses/{id}/inscriptions - Get inscriptions for a course (not in swagger but likely needed)
  getInscriptionsByCourse(courseId: string): Observable<Inscription[]> {
    if (environment.useMockData){  // Fake data for development
      const fakeInscriptions: Inscription[] = [
        {
          id: '1',
          course_id: courseId,
          user_id: '1',
          enrollment_date: '2025-01-15T10:00:00Z'
        },
        {
          id: '2',
          course_id: courseId,
          user_id: '2',
          enrollment_date: '2025-01-16T11:00:00Z'
        },
        {
          id: '3',
          course_id: courseId,
          user_id: '3',
          enrollment_date: '2025-01-17T09:00:00Z'
        }
      ];
      return of(fakeInscriptions);
    }

    return this.get<Inscription[]>(`/courses/${courseId}/inscriptions`);
  }

  // GET /users/{id}/inscriptions - Get inscriptions for a user (not in swagger but likely needed)
  getInscriptionsByUser(userId: string): Observable<Inscription[]> {
    if (environment.useMockData){  // Fake data for development
      const fakeInscriptions: Inscription[] = [
        {
          id: '1',
          course_id: '1',
          user_id: userId,
          enrollment_date: '2025-01-15T10:00:00Z'
        },
        {
          id: '2',
          course_id: '2',
          user_id: userId,
          enrollment_date: '2025-01-16T11:00:00Z'
        }
      ];
      return of(fakeInscriptions);
    }

    return this.get<Inscription[]>(`/users/${userId}/inscriptions`);
  }

  // POST /inscriptions - Create inscription manually (not in swagger but might be needed for admin)
  createInscription(courseId: string, userId: string): Observable<Inscription> {
    if (environment.useMockData){  // Empty function for now - will be implemented when backend is ready
      console.log('Creating inscription:', { courseId, userId });
      return of({} as Inscription);
    }

    return this.post<Inscription>('/inscriptions', { course_id: courseId, user_id: userId });
  }

  // DELETE /inscriptions/{id} - Delete inscription (not in swagger but might be needed for admin)
  deleteInscription(inscriptionId: string): Observable<any> {
    if (environment.useMockData){  // Empty function for now - will be implemented when backend is ready
      console.log('Deleting inscription:', inscriptionId);
      return of({ message: 'Inscription deleted successfully' });
    }

    return this.delete(`/inscriptions/${inscriptionId}`);
  }
}
