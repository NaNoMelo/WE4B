import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { Notification } from '../models/api.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends ApiService {

  // GET /courses/{id}/notifications - Get notifications for a course
  getNotificationsByCourse(courseId: string): Observable<Notification[]> {
    if (environment.useMockData){  // Fake data for development
      const fakeNotifications: Notification[] = [
        {
          id: '1',
          title: 'Nouveau devoir disponible',
          description: 'Un nouveau devoir de mathématiques est disponible. Date limite: 30 juin 2025',
          date_time: '2025-06-25T10:00:00Z',
          user_id: '1',
          course_id: courseId
        },
        {
          id: '2',
          title: 'Quiz Java POO',
          description: 'Un quiz sur les concepts de base de la POO est maintenant disponible',
          date_time: '2025-06-24T15:30:00Z',
          user_id: '1',
          course_id: courseId
        },
        {
          id: '3',
          title: 'Nouveau chapitre disponible',
          description: 'Le chapitre 5 sur l\'héritage est maintenant disponible dans les ressources',
          date_time: '2025-06-23T09:00:00Z',
          user_id: '1',
          course_id: courseId
        }
      ];
      return of(fakeNotifications);
    }

    return this.get<Notification[]>(`/courses/${courseId}/notifications`);
  }

  // POST /courses/{id}/notifications - Create a notification
  createNotification(courseId: string, notificationData: Omit<Notification, 'id' | 'date_time' | 'course_id'>): Observable<Notification> {
    if (environment.useMockData){// Mock response for development
      console.log('Creating notification for course:', courseId, notificationData);
      const newNotification: Notification = {
        id: Date.now().toString(),
        ...notificationData,
        date_time: new Date().toISOString(),
        course_id: courseId
      };
      return of(newNotification);
    }

    return this.post<Notification>(`/courses/${courseId}/notifications`, notificationData);
  }

  // GET /notifications - Get all notifications for current user (not in swagger but likely needed)
  getAllNotifications(): Observable<Notification[]> {
    if (environment.useMockData){// Fake data for development
      const fakeNotifications: Notification[] = [
        {
          id: '1',
          title: 'Nouveau devoir disponible',
          description: 'Un nouveau devoir de mathématiques est disponible',
          date_time: '2025-06-25T10:00:00Z',
          user_id: '1',
          course_id: '1'
        },
        {
          id: '2',
          title: 'Quiz Java POO',
          description: 'Un quiz sur les concepts de base de la POO est maintenant disponible',
          date_time: '2025-06-24T15:30:00Z',
          user_id: '1',
          course_id: '2'
        }
      ];
      return of(fakeNotifications);
    }

    return this.get<Notification[]>('/notifications');
  }

  // DELETE /notifications/{id} - Delete notification (not in swagger but likely needed)
  deleteNotification(notificationId: string): Observable<any> {
    if (environment.useMockData){// Empty function for now - will be implemented when backend is ready
      console.log('Deleting notification:', notificationId);
      return of({ message: 'Notification deleted successfully' });
    }

    return this.delete(`/notifications/${notificationId}`);
  }
}
