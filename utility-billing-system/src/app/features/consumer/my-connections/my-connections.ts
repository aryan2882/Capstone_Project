// my-connections.component.ts - Updated with Signals

import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { ConsumerService } from '../../../core/services/consumer';

@Component({
  selector: 'app-my-connections',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  template: `
    <div class="connections-container">
      <div class="page-header">
        <h1><mat-icon>power</mat-icon> My Connections</h1>
        <p>Manage your utility connections and meter information</p>
      </div>

      <div *ngIf="loading()" class="loading">
        <mat-spinner></mat-spinner>
      </div>

      <div *ngIf="!loading()">
        <div class="connections-summary">
          <mat-card class="summary-card">
            <mat-icon>power</mat-icon>
            <div>
              <h3>{{connections.length}}</h3>
              <p>Total Connections</p>
            </div>
          </mat-card>
          <mat-card class="summary-card active">
            <mat-icon>check_circle</mat-icon>
            <div>
              <h3>{{activeConnectionsCount}}</h3>
              <p>Active Connections</p>
            </div>
          </mat-card>
          <mat-card class="summary-card inactive">
            <mat-icon>cancel</mat-icon>
            <div>
              <h3>{{inactiveConnectionsCount}}</h3>
              <p>Inactive Connections</p>
            </div>
          </mat-card>
        </div>

        <div *ngIf="connections.length === 0" class="empty-state">
          <mat-icon>power_off</mat-icon>
          <h2>No Connections Found</h2>
          <p>You don't have any utility connections yet.</p>
        </div>

        <div class="connections-grid" *ngIf="connections.length > 0">
          <mat-card *ngFor="let connection of connections" class="connection-card">
            <div class="card-header">
              <div class="utility-icon" [class]="getUtilityClass(connection.utilityTypeName)">
                <mat-icon>{{getUtilityIcon(connection.utilityTypeName)}}</mat-icon>
              </div>
              <mat-chip [class]="getConnectionStatusClass(connection.status)">
                {{connection.status}}
              </mat-chip>
            </div>

            <div class="card-content">
              <h2>{{connection.utilityTypeName}}</h2>
              
              <div class="details-grid">
                <div class="detail-item">
                  <mat-icon>speed</mat-icon>
                  <div>
                    <span class="label">Meter Number</span>
                    <span class="value">{{connection.meterNumber}}</span>
                  </div>
                </div>

                <div class="detail-item">
                  <mat-icon>attach_money</mat-icon>
                  <div>
                    <span class="label">Tariff Plan</span>
                    <span class="value">{{connection.tariffName}}</span>
                  </div>
                </div>

                <div class="detail-item">
                  <mat-icon>electrical_services</mat-icon>
                  <div>
                    <span class="label">Connection Load</span>
                    <span class="value">{{connection.connectionLoad}} KW</span>
                  </div>
                </div>

                <div class="detail-item">
                  <mat-icon>show_chart</mat-icon>
                  <div>
                    <span class="label">Initial Reading</span>
                    <span class="value">{{connection.initialReading}} units</span>
                  </div>
                </div>

                <div class="detail-item">
                  <mat-icon>event</mat-icon>
                  <div>
                    <span class="label">Activation Date</span>
                    <span class="value">{{connection.activationDate | date:'dd MMM yyyy'}}</span>
                  </div>
                </div>

                <div class="detail-item" *ngIf="connection.disconnectionDate">
                  <mat-icon>power_off</mat-icon>
                  <div>
                    <span class="label">Disconnection Date</span>
                    <span class="value">{{connection.disconnectionDate | date:'dd MMM yyyy'}}</span>
                  </div>
                </div>
              </div>

              <div class="disconnection-reason" *ngIf="connection.disconnectionReason">
                <mat-icon>info</mat-icon>
                <div>
                  <span class="label">Disconnection Reason</span>
                  <span class="reason">{{connection.disconnectionReason}}</span>
                </div>
              </div>
            </div>

            <mat-divider></mat-divider>

            <div class="card-actions">
              <button mat-button [routerLink]="['/consumer/consumption']" [queryParams]="{connectionId: connection.connectionId}">
                <mat-icon>bar_chart</mat-icon>
                View Consumption
              </button>
              <button mat-button routerLink="/consumer/bills">
                <mat-icon>receipt</mat-icon>
                View Bills
              </button>
            </div>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .connections-container { max-width: 1400px; margin: 0 auto; }
    .page-header { margin-bottom: 32px; }
    .page-header h1 { display: flex; align-items: center; gap: 12px; font-size: 28px; margin: 0 0 8px 0; }
    .page-header p { color: #666; margin: 0; }
    .loading { display: flex; justify-content: center; padding: 60px; }
    .connections-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 32px; }
    .summary-card { display: flex; align-items: center; gap: 16px; padding: 24px; transition: transform 0.3s ease; }
    .summary-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12); }
    .summary-card mat-icon { font-size: 48px; width: 48px; height: 48px; color: #667eea; }
    .summary-card.active mat-icon { color: #4caf50; }
    .summary-card.inactive mat-icon { color: #f44336; }
    .summary-card h3 { margin: 0; font-size: 32px; font-weight: 600; }
    .summary-card p { margin: 4px 0 0 0; color: #666; font-size: 14px; }
    .empty-state { text-align: center; padding: 80px 20px; color: #999; }
    .empty-state mat-icon { font-size: 100px; width: 100px; height: 100px; opacity: 0.3; }
    .empty-state h2 { margin: 24px 0 8px 0; font-size: 24px; }
    .empty-state p { font-size: 16px; }
    .connections-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(450px, 1fr)); gap: 24px; }
    .connection-card { transition: all 0.3s ease; }
    .connection-card:hover { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12); transform: translateY(-4px); }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .utility-icon { width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .utility-icon mat-icon { font-size: 32px; width: 32px; height: 32px; color: white; }
    .utility-icon.electricity { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .utility-icon.water { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    .utility-icon.gas { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
    .card-content h2 { font-size: 24px; margin: 0 0 20px 0; font-weight: 600; }
    .details-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 16px; }
    .detail-item { display: flex; gap: 12px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; }
    .detail-item mat-icon { color: #667eea; font-size: 20px; width: 20px; height: 20px; }
    .detail-item div { display: flex; flex-direction: column; }
    .label { font-size: 12px; color: #999; margin-bottom: 4px; }
    .value { font-weight: 500; font-size: 14px; }
    .disconnection-reason { display: flex; gap: 12px; padding: 16px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px; margin-top: 16px; }
    .disconnection-reason mat-icon { color: #856404; font-size: 24px; width: 24px; height: 24px; }
    .disconnection-reason div { flex: 1; }
    .disconnection-reason .label { font-size: 12px; color: #856404; margin-bottom: 6px; font-weight: 600; }
    .reason { color: #856404; font-size: 14px; }
    mat-divider { margin: 20px 0; }
    .card-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .card-actions button { display: flex; align-items: center; gap: 8px; }
    mat-chip.status-active { background-color: #4caf50; color: #fff; }
    mat-chip.status-disconnected { background-color: #f44336; color: #fff; }
    mat-chip.status-suspended { background-color: #9e9e9e; color: #fff; }
    @media (max-width: 768px) {
      .connections-grid { grid-template-columns: 1fr; }
      .details-grid { grid-template-columns: 1fr !important; }
      .card-actions { flex-direction: column; }
      .card-actions button { width: 100%; }
    }
  `]
})
export class MyConnectionsComponent implements OnInit {
  loading = signal(true);
  
  constructor(private consumerService: ConsumerService) {}
  
  // Use getters to access service signals (avoids initialization order issues)
  get connections() {
    return this.consumerService.connections();
  }
  
  get activeConnectionsCount(): number {
    return this.connections.filter(c => c.status === 'Active').length;
  }
  
  get inactiveConnectionsCount(): number {
    return this.connections.filter(c => c.status !== 'Active').length;
  }

  ngOnInit(): void {
    this.loadConnections();
  }

  loadConnections(): void {
    const profile = this.consumerService.profile();
    
    if (profile) {
      // Profile already loaded
      this.consumerService.getMyConnections(profile.consumerId).subscribe({
        next: () => this.loading.set(false),
        error: (err) => {
          console.error('Error loading connections:', err);
          this.loading.set(false);
        }
      });
    } else {
      // Load everything
      this.consumerService.loadAllConsumerData().subscribe({
        next: () => this.loading.set(false),
        error: (err) => {
          console.error('Error loading data:', err);
          this.loading.set(false);
        }
      });
    }
  }

  getUtilityIcon(utilityType: string): string {
    const icons: { [key: string]: string } = {
      'Electricity': 'bolt',
      'Water': 'water_drop',
      'Gas': 'local_fire_department'
    };
    return icons[utilityType] || 'power';
  }

  getUtilityClass(utilityType: string): string {
    return utilityType.toLowerCase();
  }

  getConnectionStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Active': 'status-active',
      'Disconnected': 'status-disconnected',
      'Suspended': 'status-suspended'
    };
    return statusMap[status] || '';
  }
}