import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDividerModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {

  activeTab = signal<'consumers' | 'connections' | 'billingcycles'>('consumers');
  data = signal<any[]>([]);
  displayedColumns = signal<string[]>([]);

  constructor(private http: HttpClient) {}

  selectTab(tab: 'consumers' | 'connections' | 'billingcycles') {
    this.activeTab.set(tab);

    if (tab === 'consumers') this.loadConsumers();
    if (tab === 'connections') this.loadConnections();
    if (tab === 'billingcycles') this.loadBillingCycles();
  }

  loadConsumers() {
    this.displayedColumns.set([
      'consumerId', 'consumerCode', 'firstName', 'lastName', 'email', 'phone'
    ]);

    this.http.get<any[]>('http://localhost:5128/api/consumers').subscribe(res => {
      this.data.set(res);
    });
  }

  loadConnections() {
    this.displayedColumns.set([
      'connectionId', 'consumerName', 'meterNumber', 'utilityTypeName', 'status'
    ]);

    this.http.get<any[]>('http://localhost:5128/api/connections').subscribe(res => {
      this.data.set(res);
    });
  }

  loadBillingCycles() {
    this.displayedColumns.set([
      'billingCycleId', 'cycleName', 'startDate', 'endDate', 'isClosed'
    ]);

    this.http.get<any[]>('http://localhost:5128/api/billingcycles').subscribe(res => {
      this.data.set(res);
    });
  }
}
