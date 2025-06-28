import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  protected baseUrl = environment.apiUrl;
  private token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('authToken');
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (this.token) {
      headers = headers.set('Authorization', `Bearer ${this.token}`);
    }

    return headers;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  removeToken(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }

  // Generic HTTP methods (protected to prevent accidental API calls when using mock data)
  protected get<T>(endpoint: string): Observable<T> {
    if (environment.useMockData) {
      console.warn(`Attempted HTTP GET call to ${endpoint} blocked - using mock data only`);
      throw new Error('HTTP calls are disabled when useMockData is true. Use mock data in your service methods.');
    }
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { headers: this.getHeaders() });
  }

  protected post<T>(endpoint: string, data: any): Observable<T> {
    if (environment.useMockData) {
      console.warn(`Attempted HTTP POST call to ${endpoint} blocked - using mock data only`);
      throw new Error('HTTP calls are disabled when useMockData is true. Use mock data in your service methods.');
    }
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data, { headers: this.getHeaders() });
  }

  protected put<T>(endpoint: string, data: any): Observable<T> {
    if (environment.useMockData) {
      console.warn(`Attempted HTTP PUT call to ${endpoint} blocked - using mock data only`);
      throw new Error('HTTP calls are disabled when useMockData is true. Use mock data in your service methods.');
    }
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data, { headers: this.getHeaders() });
  }

  protected delete<T>(endpoint: string): Observable<T> {
    if (environment.useMockData) {
      console.warn(`Attempted HTTP DELETE call to ${endpoint} blocked - using mock data only`);
      throw new Error('HTTP calls are disabled when useMockData is true. Use mock data in your service methods.');
    }
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, { headers: this.getHeaders() });
  }

  protected postFile<T>(endpoint: string, formData: FormData): Observable<T> {
    if (environment.useMockData) {
      console.warn(`Attempted HTTP file upload call to ${endpoint} blocked - using mock data only`);
      throw new Error('HTTP calls are disabled when useMockData is true. Use mock data in your service methods.');
    }
    let headers = new HttpHeaders();
    if (this.token) {
      headers = headers.set('Authorization', `Bearer ${this.token}`);
    }
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, formData, { headers });
  }
}
