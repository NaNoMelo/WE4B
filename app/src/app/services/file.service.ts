import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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
    
    // Fake response for development
    const fakeFileResponse: FileModel = {
      id: 'file-' + Date.now(),
      name: file.name.split('.')[0],
      extension: file.name.split('.').pop() || ''
    };
    
    return of(fakeFileResponse);
  }

  // GET /files/{id} - Get file by ID (not in swagger but likely needed)
  getFileById(fileId: string): Observable<FileModel> {
    // Fake data for development
    const fakeFile: FileModel = {
      id: fileId,
      name: 'sample-document',
      extension: 'pdf'
    };
    return of(fakeFile);
    // Real implementation: return this.get<FileModel>(`/files/${fileId}`);
  }

  // GET /files/{id}/download - Download file (not in swagger but likely needed)
  downloadFile(fileId: string): Observable<Blob> {
    // Empty function for now - will be implemented when backend is ready
    console.log('Downloading file:', fileId);
    
    // Fake blob for development
    const fakeBlob = new Blob(['Fake file content'], { type: 'application/pdf' });
    return of(fakeBlob);
    // Real implementation: return this.get<Blob>(`/files/${fileId}/download`);
  }

  // DELETE /files/{id} - Delete file (not in swagger but likely needed)
  deleteFile(fileId: string): Observable<any> {
    // Empty function for now - will be implemented when backend is ready
    console.log('Deleting file:', fileId);
    return of({ message: 'File deleted successfully' });
    // Real implementation: return this.delete(`/files/${fileId}`);
  }

  // Helper method to get download URL for files
  getFileDownloadUrl(fileId: string): string {
    return `${this.baseUrl}/files/${fileId}/download`;
  }

  // Helper method to trigger file download
  triggerFileDownload(fileId: string, fileName: string): void {
    this.downloadFile(fileId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
