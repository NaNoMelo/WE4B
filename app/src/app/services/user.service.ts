import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/api.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiService {

  // GET /users - Get all users
  getAllUsers(): Observable<User[]> {
    if (environment.useMockData){// Fake data for development - matches IDs used in assignment service
      const fakeUsers: User[] = [
        {
          id: '1',
          email: 'student@example.com',
          name: 'Dupont',
          first_name: 'Jean',
          roles: ['ROLE_USER']
        },
        {
          id: '2',
          email: 'teacher@example.com',
          name: 'Martin',
          first_name: 'Marie',
          roles: ['ROLE_TEACHER']
        },
        {
          id: '3',
          email: 'admin@example.com',
          name: 'Admin',
          first_name: 'Super',
          roles: ['ROLE_ADMIN']
        },
        {
          id: '4',
          email: 'teacher.admin@example.com',
          name: 'Professeur',
          first_name: 'Pierre',
          roles: ['ROLE_TEACHER', 'ROLE_ADMIN']
        },
        {
          id: '5',
          email: 'marie.dubois@example.com',
          name: 'Dubois',
          first_name: 'Marie',
          roles: ['ROLE_USER']
        },
        {
          id: '6',
          email: 'sophie.laurent@example.com',
          name: 'Laurent',
          first_name: 'Sophie',
          roles: ['ROLE_USER']
        },
        {
          id: '7',
          email: 'thomas.bernard@example.com',
          name: 'Bernard',
          first_name: 'Thomas',
          roles: ['ROLE_USER']
        },
        {
          id: '8',
          email: 'julie.moreau@example.com',
          name: 'Moreau',
          first_name: 'Julie',
          roles: ['ROLE_USER']
        },
        {
          id: '9',
          email: 'antoine.leroy@example.com',
          name: 'Leroy',
          first_name: 'Antoine',
          roles: ['ROLE_USER']
        }
      ];
      return of(fakeUsers);
    }

    return this.get<User[]>('/users');
  }

  // GET /users/{id} - Get user by ID
  getUserById(id: string): Observable<User> {
      if (environment.useMockData){// Use the same fake data defined in getAllUsers
      const fakeUsers: User[] = [
        {
          id: '1',
          email: 'student@example.com',
          name: 'Dupont',
          first_name: 'Jean',
          roles: ['ROLE_USER']
        },
        {
          id: '2',
          email: 'teacher@example.com',
          name: 'Martin',
          first_name: 'Marie',
          roles: ['ROLE_TEACHER']
        },
        {
          id: '3',
          email: 'admin@example.com',
          name: 'Admin',
          first_name: 'Super',
          roles: ['ROLE_ADMIN']
        },
        {
          id: '4',
          email: 'teacher.admin@example.com',
          name: 'Professeur',
          first_name: 'Pierre',
          roles: ['ROLE_TEACHER', 'ROLE_ADMIN']
        },
        {
          id: '5',
          email: 'marie.dubois@example.com',
          name: 'Dubois',
          first_name: 'Marie',
          roles: ['ROLE_USER']
        },
        {
          id: '6',
          email: 'sophie.laurent@example.com',
          name: 'Laurent',
          first_name: 'Sophie',
          roles: ['ROLE_USER']
        },
        {
          id: '7',
          email: 'thomas.bernard@example.com',
          name: 'Bernard',
          first_name: 'Thomas',
          roles: ['ROLE_USER']
        },
        {
          id: '8',
          email: 'julie.moreau@example.com',
          name: 'Moreau',
          first_name: 'Julie',
          roles: ['ROLE_USER']
        },
        {
          id: '9',
          email: 'antoine.leroy@example.com',
          name: 'Leroy',
          first_name: 'Antoine',
          roles: ['ROLE_USER']
        }
      ];

      const foundUser = fakeUsers.find(user => user.id === id);
    
    
    if (foundUser) {
      return of(foundUser);
    }

    // Fallback user if not found
    const fallbackUser: User = {
      id: id,
      email: 'unknown@example.com',
      name: 'Utilisateur',
      first_name: 'Inconnu',
      roles: ['ROLE_USER']
    };
    return of(fallbackUser);
  }

    return this.get<User>(`/users/${id}`);
  }

  // PUT /users/{id} - Update user by ID
  updateUser(id: string, userData: Partial<User>): Observable<User> {
    if (environment.useMockData){// Mock response for development
      console.log('Updating user:', id, userData);
      return of({} as User);
    }

    return this.put<User>(`/users/${id}`, userData);
  }

  // DELETE /users/{id} - Delete user by ID
  deleteUser(id: string): Observable<any> {
    if (environment.useMockData){// Mock response for development
      console.log('Deleting user:', id);
      return of({ message: 'User deleted successfully' });
    }

    return this.delete(`/users/${id}`);
  }
}
