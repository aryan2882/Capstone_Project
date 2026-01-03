// account-officer-dashboard.component.ts

import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { AccountOfficerService } from '../../../core/services/account-officer';

@Component({
  selector: 'app-account-officer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <div class="dashboard-container">
      <div *ngIf="loading()" class="loading">
        <mat-spinner></mat-spinner>
      </div>

      <div *ngIf="!loading()">
        <!-- Welcome Header -->
        <div class="welcome-header">
          <div>
            <h1>Account Officer Dashboard 📊</h1>
            <p>Manage payments, bills, and consumer accounts</p>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <mat-card class="stat-card outstanding">
            <div class="stat-icon">
              <mat-icon>warning</mat-icon>
            </div>
            <div class="stat-content">
              <h3>₹{{dashboardStats.totalOutstanding | number:'1.2-2'}}</h3>
              <p>Total Outstanding</p>
            </div>
          </mat-card>

          <mat-card class="stat-card consumers">
            <div class="stat-icon">
              <mat-icon>people</mat-icon>
            </div>
            <div class="stat-content">
              <h3>{{dashboardStats.totalConsumers}}</h3>
              <p>Total Consumers</p>
            </div>
          </mat-card>

          <mat-card class="stat-card bills">
            <div class="stat-icon">
              <mat-icon>receipt</mat-icon>
            </div>
            <div class="stat-content">
              <h3>{{dashboardStats.outstandingBillsCount}}</h3>
              <p>Outstanding Bills</p>
            </div>
          </mat-card>

          <mat-card class="stat-card payments">
            <div class="stat-icon">
              <mat-icon>payments</mat-icon>
            </div>
            <div class="stat-content">
              <h3>₹{{dashboardStats.totalPayments | number:'1.2-2'}}</h3>
              <p>Payments Received</p>
            </div>
          </mat-card>
        </div>

        <!-- Content Grid -->
        <div class="content-grid">
          <!-- Recent Outstanding Bills -->
          <mat-card class="content-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>warning</mat-icon>
                Top Outstanding Bills
              </mat-card-title>
              <button mat-button color="primary" routerLink="/account-officer/outstanding">
                View All
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </mat-card-header>
            <mat-card-content>
              <div *ngIf="topOutstandingBills.length === 0" class="empty-state">
                <mat-icon>check_circle</mat-icon>
                <p>No outstanding bills!</p>
              </div>

              <div class="bills-list" *ngIf="topOutstandingBills.length > 0">
                <div class="bill-item" *ngFor="let bill of topOutstandingBills">
                  <div class="bill-info">
                    <h4>{{bill.billNumber}}</h4>
                    <p>{{bill.consumerName}} - {{bill.consumerCode}}</p>
                    <span class="utility-badge">
                      <mat-icon>{{bill.utilityTypeName === 'Electricity' ? 'bolt' : 'water_drop'}}</mat-icon>
                      {{bill.utilityTypeName}}
                    </span>
                  </div>
                  <div class="bill-amount">
                    <div class="amount">₹{{bill.outstandingAmount | number:'1.2-2'}}</div>
                    <span class="due-date">Due: {{bill.dueDate | date:'dd MMM'}}</span>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Recent Payments -->
          <mat-card class="content-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>payments</mat-icon>
                Recent Payments
              </mat-card-title>
              <button mat-button color="primary" routerLink="/account-officer/payments">
                View All
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </mat-card-header>
            <mat-card-content>
              <div *ngIf="recentPayments.length === 0" class="empty-state">
                <mat-icon>inbox</mat-icon>
                <p>No payments yet</p>
              </div>

              <div class="payments-list" *ngIf="recentPayments.length > 0">
                <div class="payment-item" *ngFor="let payment of recentPayments">
                  <div class="payment-icon" [class]="payment.paymentMode.toLowerCase()">
                    <mat-icon>{{getPaymentIcon(payment.paymentMode)}}</mat-icon>
                  </div>
                  <div class="payment-info">
                    <h4>{{payment.receiptNumber}}</h4>
                    <p>{{payment.billNumber}}</p>
                  </div>
                  <div class="payment-amount">
                    <div class="amount">₹{{payment.amount | number:'1.2-2'}}</div>
                    <mat-chip [class]="payment.paymentMode.toLowerCase()">{{payment.paymentMode}}</mat-chip>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <h2>Quick Actions</h2>
          <div class="actions-grid">
            <button mat-raised-button color="primary" routerLink="/account-officer/make-payment">
              <mat-icon>add_circle</mat-icon>
              Record Payment
            </button>
            <button mat-raised-button color="accent" routerLink="/account-officer/outstanding">
              <mat-icon>warning</mat-icon>
              Outstanding Bills
            </button>
            <button mat-raised-button routerLink="/account-officer/consumers">
              <mat-icon>people</mat-icon>
              View Consumers
            </button>
            <button mat-raised-button routerLink="/account-officer/payments">
              <mat-icon>payments</mat-icon>
              All Payments
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { max-width: 1400px; margin: 0 auto; padding: 24px; }
    .loading { display: flex; justify-content: center; padding: 60px; }
    
    .welcome-header { margin-bottom: 32px; padding: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white; }
    .welcome-header h1 { margin: 0 0 8px 0; font-size: 28px; }
    .welcome-header p { margin: 0; opacity: 0.9; }
    
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 32px; }
    .stat-card { display: flex; align-items: center; padding: 24px; cursor: default; transition: transform 0.3s ease; }
    .stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12); }
    
    .stat-icon { width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 16px; }
    .stat-icon mat-icon { font-size: 32px; width: 32px; height: 32px; color: white; }
    
    .stat-card.outstanding .stat-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .stat-card.consumers .stat-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .stat-card.bills .stat-icon { background: linear-gradient(135deg, #fccb90 0%, #d57eeb 100%); }
    .stat-card.payments .stat-icon { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
    
    .stat-content h3 { margin: 0; font-size: 28px; font-weight: 600; }
    .stat-content p { margin: 4px 0 0 0; color: #666; font-size: 14px; }
    
    .content-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(500px, 1fr)); gap: 24px; margin-bottom: 32px; }
    .content-card mat-card-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #e0e0e0; }
    .content-card mat-card-title { display: flex; align-items: center; gap: 12px; font-size: 18px; font-weight: 600; margin: 0; }
    .content-card mat-card-title mat-icon { color: #667eea; }
    .content-card mat-card-content { padding: 24px; }
    .content-card button { display: flex; align-items: center; gap: 4px; }
    
    .empty-state { text-align: center; padding: 40px 20px; color: #999; }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; opacity: 0.3; }
    .empty-state p { margin-top: 16px; }
    
    .bills-list, .payments-list { display: flex; flex-direction: column; gap: 12px; }
    
    .bill-item { display: flex; justify-content: space-between; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px; transition: all 0.3s ease; }
    .bill-item:hover { border-color: #667eea; box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1); }
    .bill-info h4 { margin: 0 0 4px 0; font-size: 16px; }
    .bill-info p { margin: 0 0 8px 0; color: #666; font-size: 14px; }
    .utility-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px; background-color: #e3f2fd; color: #1976d2; border-radius: 12px; font-size: 13px; }
    .utility-badge mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .bill-amount { text-align: right; }
    .bill-amount .amount { font-size: 20px; font-weight: 600; color: #f5576c; }
    .due-date { font-size: 12px; color: #999; }
    
    .payment-item { display: flex; align-items: center; gap: 12px; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px; transition: all 0.3s ease; }
    .payment-item:hover { border-color: #667eea; box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1); }
    .payment-icon { width: 48px; height: 48px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
    .payment-icon mat-icon { color: white; font-size: 24px; width: 24px; height: 24px; }
    .payment-icon.online { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .payment-icon.cash { background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%); }
    .payment-info { flex: 1; }
    .payment-info h4 { margin: 0 0 4px 0; font-size: 14px; }
    .payment-info p { margin: 0; color: #666; font-size: 13px; }
    .payment-amount { text-align: right; }
    .payment-amount .amount { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
    mat-chip.online { background-color: #667eea; color: white; }
    mat-chip.cash { background-color: #4caf50; color: white; }
    
    .quick-actions h2 { font-size: 20px; font-weight: 600; margin-bottom: 16px; }
    .actions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
    .actions-grid button { padding: 16px; height: auto; display: flex; flex-direction: column; gap: 8px; align-items: center; }
    .actions-grid mat-icon { font-size: 32px; width: 32px; height: 32px; }
    
    @media (max-width: 768px) {
      .stats-grid, .content-grid, .actions-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AccountOfficerDashboardComponent implements OnInit {
  loading = signal(true);

  constructor(private aoService: AccountOfficerService) {}

  get consumers() {
    return this.aoService.consumers();
  }

  get outstandingBills() {
    return this.aoService.outstandingBills();
  }

  get payments() {
    return this.aoService.payments();
  }

  get dashboardStats() {
    return {
      totalOutstanding: this.aoService.totalOutstanding(),
      totalConsumers: this.consumers.length,
      outstandingBillsCount: this.outstandingBills.length,
      totalPayments: this.aoService.totalPaymentsReceived()
    };
  }

  get topOutstandingBills() {
    return this.outstandingBills
      .sort((a, b) => b.outstandingAmount - a.outstandingAmount)
      .slice(0, 5);
  }

  get recentPayments() {
    return this.payments.slice(0, 5);
  }

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.aoService.loadAllData().subscribe({
      next: () => this.loading.set(false),
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.loading.set(false);
      }
    });
  }

  getPaymentIcon(mode: string): string {
    const icons: { [key: string]: string } = {
      'Online': 'online_prediction',
      'Cash': 'payments',
      'Cheque': 'receipt_long'
    };
    return icons[mode] || 'payment';
  }
}