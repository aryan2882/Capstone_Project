// payments.component.ts

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AccountOfficerService } from '../../../core/services/account-officer';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  template: `
    <div class="payments-container">
      <div class="page-header">
        <div>
          <h1><mat-icon>payments</mat-icon> Payment History</h1>
          <p>View all payment transactions</p>
        </div>
        <button mat-raised-button color="primary" routerLink="/account-officer/make-payment">
          <mat-icon>add_circle</mat-icon>
          Record Payment
        </button>
      </div>

      <div *ngIf="loading()" class="loading">
        <mat-spinner></mat-spinner>
      </div>

      <div *ngIf="!loading()">
        <!-- Summary Cards -->
        <div class="summary-cards">
          <mat-card class="summary-card">
            <mat-icon>payments</mat-icon>
            <div>
              <h3>{{filteredPayments.length}}</h3>
              <p>Total Payments</p>
            </div>
          </mat-card>
          <mat-card class="summary-card">
            <mat-icon>currency_rupee</mat-icon>
            <div>
              <h3>₹{{getTotalAmount() | number:'1.2-2'}}</h3>
              <p>Total Collected</p>
            </div>
          </mat-card>
          <mat-card class="summary-card">
            <mat-icon>online_prediction</mat-icon>
            <div>
              <h3>{{getOnlinePayments().length}}</h3>
              <p>Online Payments</p>
            </div>
          </mat-card>
          <mat-card class="summary-card">
            <mat-icon>account_balance_wallet</mat-icon>
            <div>
              <h3>{{getCashPayments().length}}</h3>
              <p>Offline Payments</p>
            </div>
          </mat-card>
        </div>

        <!-- Filters -->
        <mat-card class="filters-card">
          <div class="filters">
            <mat-form-field appearance="outline">
              <mat-label>Search</mat-label>
              <input matInput placeholder="Receipt, bill, transaction ID..." [(ngModel)]="searchTerm" (ngModelChange)="applyFilters()">
              <mat-icon matPrefix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Payment Mode</mat-label>
              <mat-select [(ngModel)]="modeFilter" (selectionChange)="applyFilters()">
                <mat-option value="">All</mat-option>
                <mat-option value="Online">Online</mat-option>
                <mat-option value="Cash">Cash</mat-option>
                <mat-option value="Cheque">Cheque</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-raised-button (click)="clearFilters()">
              <mat-icon>clear</mat-icon>
              Clear
            </button>
          </div>
        </mat-card>

        <!-- Payments List -->
        <mat-card>
          <div *ngIf="filteredPayments.length === 0" class="empty-state">
            <mat-icon>receipt_long</mat-icon>
            <h2>No Payments Found</h2>
            <p>No payments match your search criteria.</p>
          </div>

          <div *ngIf="filteredPayments.length > 0" class="payments-list">
            <div class="payment-card" *ngFor="let payment of filteredPayments">
              <div class="payment-header">
                <div class="payment-icon" [class]="payment.paymentMode.toLowerCase()">
                  <mat-icon>{{getPaymentIcon(payment.paymentMode)}}</mat-icon>
                </div>
                <div class="payment-info">
                  <h3>{{payment.receiptNumber}}</h3>
                  <p class="bill-number">Bill: {{payment.billNumber}}</p>
                  <span class="payment-date">
                    <mat-icon>event</mat-icon>
                    {{payment.paymentDate | date:'dd MMM yyyy, hh:mm a'}}
                  </span>
                </div>
                <div class="payment-amount">
                  <div class="amount">₹{{payment.amount | number:'1.2-2'}}</div>
                  <mat-chip [class]="payment.paymentMode.toLowerCase()">
                    {{payment.paymentMode}}
                  </mat-chip>
                </div>
              </div>

              <div class="payment-details">
                <div class="detail-grid">
                  <div class="detail-item" *ngIf="payment.consumerId">
                    <mat-icon>person</mat-icon>
                    <div>
                      <span class="label">Consumer ID</span>
                      <span class="value">{{payment.consumerId}}</span>
                    </div>
                  </div>

                  <div class="detail-item" *ngIf="payment.transactionId">
                    <mat-icon>tag</mat-icon>
                    <div>
                      <span class="label">Transaction ID</span>
                      <span class="value transaction-id">{{payment.transactionId}}</span>
                    </div>
                  </div>

                  <div class="detail-item">
                    <mat-icon>receipt</mat-icon>
                    <div>
                      <span class="label">Bill Number</span>
                      <span class="value">{{payment.billNumber}}</span>
                    </div>
                  </div>

                  <div class="detail-item">
                    <mat-icon>confirmation_number</mat-icon>
                    <div>
                      <span class="label">Receipt Number</span>
                      <span class="value">{{payment.receiptNumber}}</span>
                    </div>
                  </div>
                </div>

                <div class="payment-remarks" *ngIf="payment.remarks">
                  <mat-icon>notes</mat-icon>
                  <span>{{payment.remarks}}</span>
                </div>
              </div>

              <div class="payment-actions">
                <button mat-button>
                  <mat-icon>download</mat-icon>
                  Download Receipt
                </button>
                <button mat-button>
                  <mat-icon>print</mat-icon>
                  Print
                </button>
              </div>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .payments-container { max-width: 1400px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    .page-header h1 { display: flex; align-items: center; gap: 12px; font-size: 28px; margin: 0 0 4px 0; }
    .page-header p { color: #666; margin: 0; }
    .page-header button { display: flex; align-items: center; gap: 8px; }
    
    .loading { display: flex; justify-content: center; padding: 60px; }
    
    .summary-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 24px; }
    .summary-card { display: flex; align-items: center; gap: 16px; padding: 24px; }
    .summary-card mat-icon { font-size: 48px; width: 48px; height: 48px; color: #667eea; }
    .summary-card h3 { margin: 0; font-size: 28px; font-weight: 600; }
    .summary-card p { margin: 4px 0 0 0; color: #666; font-size: 14px; }
    
    .filters-card { padding: 24px; margin-bottom: 24px; }
    .filters { display: grid; grid-template-columns: 2fr 1fr auto; gap: 16px; align-items: center; }
    .filters mat-form-field { width: 100%; }
    
    .empty-state { text-align: center; padding: 80px 20px; }
    .empty-state mat-icon { font-size: 100px; width: 100px; height: 100px; color: #999; opacity: 0.5; }
    .empty-state h2 { margin: 24px 0 8px 0; }
    .empty-state p { color: #666; }
    
    .payments-list { display: flex; flex-direction: column; gap: 20px; padding: 24px; }
    .payment-card { border: 1px solid #e0e0e0; border-radius: 12px; padding: 24px; transition: all 0.3s ease; }
    .payment-card:hover { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-color: #667eea; }
    
    .payment-header { display: flex; gap: 16px; align-items: flex-start; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #f0f0f0; }
    .payment-icon { width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .payment-icon mat-icon { font-size: 32px; width: 32px; height: 32px; color: white; }
    .payment-icon.online { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .payment-icon.cash { background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%); }
    .payment-icon.cheque { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    
    .payment-info { flex: 1; }
    .payment-info h3 { margin: 0 0 4px 0; font-size: 18px; font-weight: 600; }
    .bill-number { margin: 0 0 8px 0; color: #666; font-size: 14px; }
    .payment-date { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #999; }
    .payment-date mat-icon { font-size: 16px; width: 16px; height: 16px; }
    
    .payment-amount { text-align: right; }
    .amount { font-size: 28px; font-weight: 600; color: #2e7d32; margin-bottom: 8px; }
    mat-chip.online { background-color: #667eea; color: white; }
    mat-chip.cash { background-color: #4caf50; color: white; }
    mat-chip.cheque { background-color: #f5576c; color: white; }
    
    .payment-details { margin-bottom: 20px; }
    .detail-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-bottom: 16px; }
    .detail-item { display: flex; gap: 12px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; }
    .detail-item mat-icon { color: #667eea; font-size: 20px; width: 20px; height: 20px; }
    .detail-item div { display: flex; flex-direction: column; }
    .label { font-size: 12px; color: #999; margin-bottom: 4px; }
    .value { font-weight: 500; font-size: 14px; }
    .transaction-id { font-family: monospace; font-size: 13px; color: #667eea; }
    
    .payment-remarks { display: flex; gap: 8px; padding: 12px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px; font-size: 14px; color: #856404; }
    .payment-remarks mat-icon { font-size: 20px; width: 20px; height: 20px; }
    
    .payment-actions { display: flex; gap: 12px; justify-content: flex-end; padding-top: 16px; border-top: 1px solid #f0f0f0; }
    .payment-actions button { display: flex; align-items: center; gap: 8px; }
    
    @media (max-width: 768px) {
      .page-header { flex-direction: column; gap: 16px; }
      .filters { grid-template-columns: 1fr; }
      .summary-cards { grid-template-columns: 1fr; }
      .payment-header { flex-direction: column; }
      .payment-amount { text-align: left; }
      .detail-grid { grid-template-columns: 1fr; }
      .payment-actions { flex-direction: column; }
      .payment-actions button { width: 100%; }
    }
  `]
})
export class PaymentsComponent implements OnInit {
  loading = signal(true);
  searchTerm = '';
  modeFilter = '';

  constructor(
    private aoService: AccountOfficerService,
    private route: ActivatedRoute
  ) {}

  get payments() {
    return this.aoService.payments();
  }

  get filteredPayments() {
    let payments = this.payments;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      payments = payments.filter(p =>
        p.receiptNumber.toLowerCase().includes(term) ||
        p.billNumber.toLowerCase().includes(term) ||
        (p.transactionId && p.transactionId.toLowerCase().includes(term))
      );
    }

    if (this.modeFilter) {
      payments = payments.filter(p => p.paymentMode === this.modeFilter);
    }

    return payments.sort((a, b) => 
      new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
    );
  }

  ngOnInit(): void {
    this.loadData();
    
    // Check for consumer filter
    this.route.queryParams.subscribe(params => {
      if (params['consumerId']) {
        // Could load consumer-specific payments here
      }
    });
  }

  loadData(): void {
    this.aoService.getAllPayments().subscribe({
      next: () => this.loading.set(false),
      error: (err) => {
        console.error('Error loading payments:', err);
        this.loading.set(false);
      }
    });
  }

  applyFilters(): void {
    // Triggers filtering through getter
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.modeFilter = '';
  }

  getTotalAmount(): number {
    return this.filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  }

  getOnlinePayments() {
    return this.filteredPayments.filter(p => p.paymentMode === 'Online');
  }

  getCashPayments() {
    return this.filteredPayments.filter(p => p.paymentMode !== 'Online');
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