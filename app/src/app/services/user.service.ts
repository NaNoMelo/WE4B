import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiService {

  // GET /users - Get all users
  getAllUsers(): Observable<User[]> {
    // Fake data for development
    const fakeUsers: User[] = [
      {
        id: '1',
        email: 'john.doe@example.com',
        name: 'Doe',
        first_name: 'John',
        roles: ['ROLE_USER']
      },
      {
        id: '2',
        email: 'marie.martin@example.com',
        name: 'Martin',
        first_name: 'Marie',
        roles: ['ROLE_TEACHER', 'ROLE_ADMIN']
      },
      {
        id: '3',
        email: 'pierre.durand@example.com',
        name: 'Durand',
        first_name: 'Pierre',
        roles: ['ROLE_TEACHER']
      }
    ];
    return of(fakeUsers);
  }

  // GET /users/{id} - Get user by ID
  getUserById(id: string): Observable<User> {
    // Fake data for development
    const fakeUser: User = {
      id: id,
      email: 'john.doe@example.com',
      name: 'Doe',
      first_name: 'John',
      roles: ['ROLE_USER']
    };
    return of(fakeUser);
  }

  // PUT /users/{id} - Update user by ID
  updateUser(id: string, userData: Partial<User>): Observable<User> {
    // Mock response for development
    console.log('Updating user:', id, userData);
    return of({} as User);
  }

  // DELETE /users/{id} - Delete user by ID
  deleteUser(id: string): Observable<any> {
    // Mock response for development
    console.log('Deleting user:', id);
    return of({ message: 'User deleted successfully' });
  }
}
