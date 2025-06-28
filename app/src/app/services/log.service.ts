import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { Log } from '../models/api.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogService extends ApiService {

  // GET /logs - Get all logs
  getAllLogs(limit?: number): Observable<Log[]> {
      if (environment.useMockData){// Mock data for development
      const fakeLogs: Log[] = [
        {
          id: '1',
          timestamp: '2025-06-27T09:30:00Z',
          description: 'Utilisateur Jean Dupont s\'est connecté avec succès',
          user_id: '1'
        },
        {
          id: '2',
          timestamp: '2025-06-27T09:35:00Z',
          description: 'Accès au cours "Programmation Orientée Objet" par Jean Dupont',
          user_id: '1'
        },
        {
          id: '3',
          timestamp: '2025-06-27T10:15:00Z',
          description: 'Création d\'un nouveau post par Marie Martin dans le cours POO',
          user_id: '2'
        },
        {
          id: '4',
          timestamp: '2025-06-27T11:00:00Z',
          description: 'Mise à jour du profil utilisateur par Jean Dupont',
          user_id: '1'
        },
        {
          id: '5',
          timestamp: '2025-06-26T18:45:00Z',
          description: 'Tentative de connexion échouée pour l\'email user@example.com',
          user_id: undefined // System log without specific user
        },
        {
          id: '6',
          timestamp: '2025-06-27T14:20:00Z',
          description: 'Téléchargement du fichier cours_chapitre_1.pdf par Jean Dupont',
          user_id: '1'
        },
        {
          id: '7',
          timestamp: '2025-06-27T15:10:00Z',
          description: 'Suppression d\'un post par Marie Martin dans le cours POO',
          user_id: '2'
        },
        {
          id: '8',
          timestamp: '2025-06-27T16:30:00Z',
          description: 'Déconnexion de l\'utilisateur Jean Dupont',
          user_id: '1'
        }
      ];

      // Apply limit if specified
      let filteredLogs = fakeLogs;
      if (limit !== undefined) {
        filteredLogs = filteredLogs.slice(0, limit);
      }

      // Sort by timestamp (most recent first)
      filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      console.log(`Getting logs, limit: ${limit}`);
      return of(filteredLogs);
    }
    
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    return this.get<Log[]>(`/logs?${params.toString()}`);
  }

  // GET /logs/user/:userId - Get logs for a specific user
  getLogsByUserId(userId: string, limit?: number): Observable<Log[]> {
    if (environment.useMockData){// Mock data for development - filter by user_id
      const fakeLogs: Log[] = [
        {
          id: '1',
          timestamp: '2025-06-27T09:30:00Z',
          description: 'Utilisateur Jean Dupont s\'est connecté avec succès',
          user_id: '1'
        },
        {
          id: '2',
          timestamp: '2025-06-27T09:35:00Z',
          description: 'Accès au cours "Programmation Orientée Objet" par Jean Dupont',
          user_id: '1'
        },
        {
          id: '3',
          timestamp: '2025-06-27T10:15:00Z',
          description: 'Création d\'un nouveau post par Marie Martin dans le cours POO',
          user_id: '2'
        },
        {
          id: '4',
          timestamp: '2025-06-27T11:00:00Z',
          description: 'Mise à jour du profil utilisateur par Jean Dupont',
          user_id: '1'
        },
        {
          id: '6',
          timestamp: '2025-06-27T14:20:00Z',
          description: 'Téléchargement du fichier cours_chapitre_1.pdf par Jean Dupont',
          user_id: '1'
        },
        {
          id: '7',
          timestamp: '2025-06-27T15:10:00Z',
          description: 'Suppression d\'un post par Marie Martin dans le cours POO',
          user_id: '2'
        },
        {
          id: '8',
          timestamp: '2025-06-27T16:30:00Z',
          description: 'Déconnexion de l\'utilisateur Jean Dupont',
          user_id: '1'
        }
      ];

      // Filter by user_id
      let filteredLogs = fakeLogs.filter(log => log.user_id === userId);
      
      // Apply limit if specified
      if (limit !== undefined) {
        filteredLogs = filteredLogs.slice(0, limit);
      }

      // Sort by timestamp (most recent first)
      filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      console.log(`Getting logs for user ${userId}, limit: ${limit}`);
      return of(filteredLogs);
    }
    
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    return this.get<Log[]>(`/logs/user/${userId}?${params.toString()}`);
  }

  // POST /logs - Add a log entry
  addLog(description: string, userId?: string): Observable<Log> {
    if (environment.useMockData){const newLog: Log = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        description,
        user_id: userId
      };

      console.log('Adding log:', newLog);
      return of(newLog);
    }
    

    return this.post<Log>('/logs', { description, user_id: userId });
  }

  // Convenience method to log activities
  log(description: string, userId?: string): void {
    this.addLog(description, userId).subscribe({
      next: (log) => console.log('Activity logged:', log),
      error: (error) => console.error('Failed to log activity:', error)
    });
  }
}
