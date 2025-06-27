import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { FileModel } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class FileService extends ApiService {

  // POST /files - Upload a file
  uploadFile(file: File): Observable<FileModel> {
    // Mock response for development
    console.log('Uploading file:', file.name);
    
    // Fake response for development with metadata
    const fakeFileResponse: FileModel = {
      id: Date.now(),
      name: file.name.split('.')[0],
      extension: file.name.split('.').pop() || '',
      size: file.size,
      mime_type: file.type || 'application/octet-stream',
      upload_date: new Date().toISOString(),
      uploaded_by: 'current_user_id' // Would be from auth context
    };
    
    return of(fakeFileResponse);
  }

  // GET /files/{id} - Get file by ID (not in swagger but likely needed)
  getFileById(fileId: number): Observable<FileModel> {
    // Mock data with specific files for development
    const mockFiles: { [key: number]: FileModel } = {
      1: {
        id: 1,
        name: 'TD1_POO_Exercices',
        extension: 'pdf',
        size: 2048576, // 2MB
        mime_type: 'application/pdf',
        upload_date: '2025-01-22T10:30:00Z',
        uploaded_by: '3'
      },
      2: {
        id: 2, 
        name: 'Cours_Chapitre1',
        extension: 'docx',
        size: 1536000, // 1.5MB
        mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        upload_date: '2025-01-16T14:00:00Z',
        uploaded_by: '3'
      },
      3: {
        id: 3,
        name: 'Correction_TP1',
        extension: 'java',
        size: 8192, // 8KB
        mime_type: 'text/x-java-source',
        upload_date: '2025-01-25T08:45:00Z',
        uploaded_by: '3'
      }
    };

    // Return specific file if it exists, otherwise default
    const fakeFile: FileModel = mockFiles[fileId] || {
      id: fileId,
      name: 'sample-document',
      extension: 'pdf',
      size: 1024000, // 1MB
      mime_type: 'application/pdf',
      upload_date: new Date().toISOString(),
      uploaded_by: '1'
    };
    
    return of(fakeFile);
    // Real implementation: return this.get<FileModel>(`/files/${fileId}`);
  }

  // GET /files/{id}/download - Download file (not in swagger but likely needed)
  downloadFile(fileId: number): Observable<Blob> {
    console.log('Downloading file:', fileId);
    
    // Get file info first to determine content type
    return this.getFileById(fileId).pipe(
      map((file: FileModel) => {
        // Determine content type based on extension
        const contentType = this.getContentType(file.extension);
        
        // Create fake file content based on file type
        let content = '';
        switch (file.extension.toLowerCase()) {
          case 'pdf':
            content = '%PDF-1.4 Fake PDF content for ' + file.name;
            break;
          case 'docx':
            content = 'Fake DOCX content for ' + file.name;
            break;
          case 'java':
            content = `// Fake Java file: ${file.name}\npublic class ${file.name} {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}`;
            break;
          case 'txt':
            content = 'Fake text file content for ' + file.name;
            break;
          default:
            content = 'Fake file content for ' + file.name;
        }
        
        return new Blob([content], { type: contentType });
      })
    );
    // Real implementation: return this.get<Blob>(`/files/${fileId}/download`);
  }

  private getContentType(extension: string): string {
    const contentTypes: { [key: string]: string } = {
      'pdf': 'application/pdf',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc': 'application/msword',
      'java': 'text/x-java-source',
      'txt': 'text/plain',
      'html': 'text/html',
      'css': 'text/css',
      'js': 'application/javascript',
      'json': 'application/json',
      'xml': 'application/xml'
    };
    
    return contentTypes[extension.toLowerCase()] || 'application/octet-stream';
  }

  // DELETE /files/{id} - Delete file (not in swagger but likely needed)
  deleteFile(fileId: number): Observable<any> {
    // Empty function for now - will be implemented when backend is ready
    console.log('Deleting file:', fileId);
    return of({ message: 'File deleted successfully' });
    // Real implementation: return this.delete(`/files/${fileId}`);
  }
}
