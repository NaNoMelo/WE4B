import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LogService } from '../services/log.service';
import { Log } from '../models/api.models';

@Component({
  selector: 'app-logs',
  imports: [CommonModule, FormsModule],
  templateUrl: './logs.html',
  styleUrl: './logs.scss'
})
export class Logs implements OnInit {
  @Input() limit: number = 50;

  protected logs: Log[] = [];
  protected isLoading: boolean = true;
  protected searchTerm: string = '';
  protected userFilter: string = '';
  protected userId: string | null = null;

  constructor(
    private logService: LogService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if we have a userId parameter from the route
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.loadLogs();
  }

  loadLogs(): void {
    this.isLoading = true;
    
    const logsObservable = this.userId 
      ? this.logService.getLogsByUserId(this.userId, this.limit)
      : this.logService.getAllLogs(this.limit);
    
    logsObservable.subscribe({
      next: (logs: Log[]) => {
        this.logs = logs;
        this.applySearch();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading logs:', error);
        this.isLoading = false;
      }
    });
  }

  private applySearch(): void {
    // Apply search term filter
    if (this.searchTerm) {
      this.logs = this.logs.filter(log => 
        log.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  onSearchChange(): void {
    this.loadLogs();
  }

  onUserFilterChange(): void {
    this.loadLogs();
  }

  refreshLogs(): void {
    this.loadLogs();
  }

  exportLogs(): void {
    // Simple CSV export
    const headers = ['Timestamp', 'Description'];
    const csvContent = [
      headers.join(','),
      ...this.logs.map(log => [
        log.timestamp,
        `"${log.description}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
