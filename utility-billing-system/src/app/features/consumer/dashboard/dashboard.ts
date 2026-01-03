// consumer-dashboard.component.ts - Updated with Signals

import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConsumerService } from '../../../core/services/consumer';

@Component({
  selector: 'app-consumer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class ConsumerDashboardComponent implements OnInit {
  // Signals for local state
  loading = signal(true);
  
  constructor(private consumerService: ConsumerService) {
    // Effect to track loading state
    effect(() => {
      const profile = this.profile;
      const bills = this.bills;
      const connections = this.connections;
      
      // Set loading to false once we have data
      if (profile && bills.length >= 0 && connections.length >= 0) {
        this.loading.set(false);
      }
    });
  }
  
  // Use getters to access service signals
  get profile() {
    return this.consumerService.profile();
  }
  
  get bills() {
    return this.consumerService.bills();
  }
  
  get connections() {
    return this.consumerService.connections();
  }
  
  // Computed values for dashboard stats
  get dashboardStats() {
    return {
      totalConnections: this.connections.length,
      activeConnections: this.connections.filter(c => c.status === 'Active').length,
      totalOutstanding: this.consumerService.totalOutstanding(),
      unpaidBills: this.consumerService.unpaidBills().length
    };
  }

  get recentBills() {
    return this.bills.slice(0, 3);
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading.set(true);
    
    // Load all data at once using the service method
    this.consumerService.loadAllConsumerData().subscribe({
      next: () => {
        // Loading state will be automatically updated by the effect
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.loading.set(false);
      }
    });
  }

  getBillStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Generated': 'status-generated',
      'Partial': 'status-partial',
      'Paid': 'status-paid',
      'Overdue': 'status-overdue'
    };
    return statusMap[status] || '';
  }

  getConnectionStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Active': 'status-active',
      'Disconnected': 'status-disconnected',
      'Suspended': 'status-suspended'
    };
    return statusMap[status] || '';
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }
}