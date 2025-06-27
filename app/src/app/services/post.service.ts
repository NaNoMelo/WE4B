import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { Post } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class PostService extends ApiService {

  // GET /courses/{id}/posts - Get posts for a course
  getPostsByCourse(courseId: string): Observable<Post[]> {
    // Always use mock data for development
    const fakePosts: Post[] = [
      {
        id: '1',
        title: 'Bienvenue dans le cours',
        description: 'Bienvenue dans ce cours de programmation orientée objet. Nous allons voir ensemble les concepts fondamentaux.',
        date_time: '2025-01-15T10:00:00Z',
        pinned: true,
        importance: 'high',
        author_id: '3',
        course_id: courseId,
        type: 'text'
      },
      {
        id: '2',
        title: 'Support de cours - Chapitre 1',
        description: 'Voici le premier chapitre du cours sur les bases de la POO.',
        date_time: '2025-01-16T14:30:00Z',
        pinned: false,
        importance: 'normal',
        author_id: '3',
        course_id: courseId,
        type: 'text'
      },
      {
        id: '3',
        title: 'Exercices pratiques',
        description: 'Série d\'exercices pour mettre en pratique les concepts vus en cours.',
        date_time: '2025-01-18T09:15:00Z',
        pinned: false,
        importance: 'low',
        author_id: '3',
        course_id: courseId,
        type: 'text'
      },
      {
        id: '4',
        title: 'Projet final',
        description: 'Instructions pour le projet final du semestre. Date limite: fin avril.',
        date_time: '2025-01-20T16:00:00Z',
        pinned: true,
        importance: 'high',
        author_id: '3',
        course_id: courseId,
        type: 'text'
      },
      {
        id: '5',
        title: 'TD1 - Exercices pratiques POO',
        description: 'Fichier PDF contenant les exercices dirigés pour la première séance de travaux dirigés.',
        date_time: '2025-01-22T11:30:00Z',
        pinned: true,
        importance: 'normal',
        author_id: '3',
        course_id: courseId,
        type: 'file',
        file_id: 'file_001'
      },
      {
        id: '6',
        title: 'Correction TP1',
        description: 'Fichier Java contenant la correction complète du premier travail pratique.',
        date_time: '2025-01-25T08:45:00Z',
        pinned: false,
        importance: 'normal',
        author_id: '3',
        course_id: courseId,
        type: 'file',
        file_id: 'file_003'
      }
    ];
    return of(fakePosts);
  }

  // GET /posts/{id} - Get post by ID
  getPostById(postId: string): Observable<Post> {
    // Mock response for development
    console.log('Getting post by ID:', postId);
    
    // Mock data matching the posts in getPostsByCourse
    const mockPosts: { [key: string]: Post } = {
      '5': {
        id: '5',
        title: 'TD1 - Exercices pratiques POO',
        description: 'Fichier PDF contenant les exercices dirigés pour la première séance de travaux dirigés.',
        date_time: '2025-01-22T11:30:00Z',
        pinned: false,
        importance: 'normal',
        author_id: '3',
        course_id: '1',
        type: 'file',
        file_id: 'file_001'
      },
      '6': {
        id: '6',
        title: 'Correction TP1',
        description: 'Fichier Java contenant la correction complète du premier travail pratique.',
        date_time: '2025-01-25T08:45:00Z',
        pinned: false,
        importance: 'normal',
        author_id: '3',
        course_id: '1',
        type: 'file',
        file_id: 'file_003'
      }
    };

    // Return specific post if it exists, otherwise default
    const fakePost: Post = mockPosts[postId] || {
      id: postId,
      title: 'Post existant',
      description: 'Contenu du post existant...',
      date_time: '2025-01-20T16:00:00Z',
      pinned: false,
      importance: 'normal',
      author_id: '3',
      course_id: '1',
      type: 'text'
    };
    return of(fakePost);
    // Real implementation: return this.get<Post>(`/posts/${postId}`);
  }

  // POST /courses/{id}/posts - Create a post in course
  createPost(courseId: string, postData: Omit<Post, 'id' | 'date_time' | 'author_id' | 'course_id'>): Observable<Post> {
    // Mock response for development
    console.log('Creating post in course:', courseId, postData);
    const newPost: Post = {
      id: Date.now().toString(),
      ...postData,
      date_time: new Date().toISOString(),
      author_id: '4', // Current user ID
      course_id: courseId
    };
    return of(newPost);
  }

  // PUT /posts/{id} - Update post
  updatePost(postId: string, postData: Partial<Post>): Observable<Post> {
    // Mock response for development
    console.log('Updating post:', postId, postData);
    const updatedPost: Post = {
      id: postId,
      title: postData.title || 'Updated Post',
      description: postData.description || 'Updated description',
      date_time: new Date().toISOString(),
      pinned: postData.pinned || false,
      importance: postData.importance || 'normal',
      author_id: '4',
      course_id: postData.course_id || '1',
      type: postData.type || 'text',
      file_id: postData.file_id
    };
    return of(updatedPost);
  }

  // DELETE /posts/{id} - Delete post
  deletePost(postId: string): Observable<any> {
    // Mock response for development
    console.log('Deleting post:', postId);
    return of({ message: 'Post deleted successfully', id: postId });
  }
}
