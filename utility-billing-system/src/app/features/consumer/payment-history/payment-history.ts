// payment-history.component.ts - Create in features/consumer/payments/

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaymentService } from '../../../core/services/payment';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule
  ],
  template: `
    <div class="payment-history-container">
      <div class="page-header">
        <div>
          <h1><mat-icon>history</mat-icon> Payment History</h1>
          <p>View all your past transactions</p>
        </div>
        <button mat-raised-button color="primary" routerLink="/consumer/bills">
          <mat-icon>payment</mat-icon>
          Make Payment
        </button>
      </div>

      <div *ngIf="loading()" class="loading">
        <mat-spinner></mat-spinner>
      </div>

      <mat-card *ngIf="!loading()">
        <mat-card-content>
          <!-- Summary Cards -->
          <div class="summary-cards">
            <div class="summary-card">
              <mat-icon>payments</mat-icon>
              <div>
                <h3>{{payments.length}}</h3>
                <p>Total Payments</p>
              </div>
            </div>
            <div class="summary-card">
              <mat-icon>currency_rupee</mat-icon>
              <div>
                <h3>₹{{getTotalPaid() | number:'1.2-2'}}</h3>
                <p>Total Amount Paid</p>
              </div>
            </div>
            <div class="summary-card">
              <mat-icon>online_prediction</mat-icon>
              <div>
                <h3>{{getOnlinePaymentCount()}}</h3>
                <p>Online Payments</p>
              </div>
            </div>
          </div>

          <!-- No Payments State -->
          <div *ngIf="payments.length === 0" class="empty-state">
            <mat-icon>receipt_long</mat-icon>
            <h2>No Payment History</h2>
            <p>You haven't made any payments yet.</p>
            <button mat-raised-button color="primary" routerLink="/consumer/bills">
              <mat-icon>payment</mat-icon>
              Pay Your First Bill
            </button>
          </div>

          <!-- Payments List -->
          <div *ngIf="payments.length > 0" class="payments-list">
            <h2>All Transactions</h2>
            
            <div class="payment-card" *ngFor="let payment of payments">
              <div class="payment-header">
                <div class="payment-icon" [class]="getPaymentModeClass(payment.paymentMode)">
                  <mat-icon>{{getPaymentModeIcon(payment.paymentMode)}}</mat-icon>
                </div>
                <div class="payment-info">
                  <h3>{{payment.billNumber}}</h3>
                  <p>Receipt: {{payment.receiptNumber}}</p>
                  <span class="payment-date">
                    <mat-icon>event</mat-icon>
                    {{payment.paymentDate | date:'dd MMM yyyy, hh:mm a'}}
                  </span>
                </div>
                <div class="payment-amount">
                  <div class="amount">₹{{payment.amount | number:'1.2-2'}}</div>
                  <mat-chip [class]="getPaymentModeClass(payment.paymentMode)">
                    {{payment.paymentMode}}
                  </mat-chip>
                </div>
              </div>

              <div class="payment-details">
                <div class="detail-grid">
                  <div class="detail-item">
                    <mat-icon>person</mat-icon>
                    <div>
                      <span class="label">Consumer</span>
                      <span class="value">{{payment.consumerName}}</span>
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
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .payment-history-container { max-width: 1200px; margin: 0 auto; }
    
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    .page-header h1 { display: flex; align-items: center; gap: 12px; font-size: 28px; margin: 0 0 4px 0; }
    .page-header p { color: #666; margin: 0; }
    .page-header button { display: flex; align-items: center; gap: 8px; }
    
    .loading { display: flex; justify-content: center; padding: 60px; }
    
    .summary-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 32px; }
    .summary-card { display: flex; align-items: center; gap: 16px; padding: 24px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; }
    .summary-card mat-icon { font-size: 48px; width: 48px; height: 48px; color: #667eea; }
    .summary-card h3 { margin: 0; font-size: 28px; font-weight: 600; }
    .summary-card p { margin: 4px 0 0 0; color: #666; font-size: 14px; }
    
    .empty-state { text-align: center; padding: 80px 20px; }
    .empty-state mat-icon { font-size: 100px; width: 100px; height: 100px; color: #999; opacity: 0.5; }
    .empty-state h2 { margin: 24px 0 8px 0; font-size: 24px; }
    .empty-state p { color: #666; margin-bottom: 24px; }
    .empty-state button { display: flex; align-items: center; gap: 8px; margin: 0 auto; }
    
    .payments-list { }
    .payments-list h2 { font-size: 20px; font-weight: 600; margin: 0 0 24px 0; padding-bottom: 16px; border-bottom: 2px solid #e0e0e0; }
    
    .payment-card { border: 1px solid #e0e0e0; border-radius: 12px; padding: 24px; margin-bottom: 20px; transition: all 0.3s ease; }
    .payment-card:hover { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-color: #667eea; }
    
    .payment-header { display: flex; gap: 16px; align-items: flex-start; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #f0f0f0; }
    
    .payment-icon { width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .payment-icon mat-icon { font-size: 32px; width: 32px; height: 32px; color: white; }
    .payment-icon.online { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .payment-icon.cash { background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%); }
    
    .payment-info { flex: 1; }
    .payment-info h3 { margin: 0 0 4px 0; font-size: 18px; font-weight: 600; }
    .payment-info p { margin: 0 0 8px 0; color: #666; font-size: 14px; }
    .payment-date { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #999; }
    .payment-date mat-icon { font-size: 16px; width: 16px; height: 16px; }
    
    .payment-amount { text-align: right; }
    .amount { font-size: 28px; font-weight: 600; color: #2e7d32; margin-bottom: 8px; }
    
    mat-chip.online { background-color: #667eea; color: white; }
    mat-chip.cash { background-color: #4caf50; color: white; }
    
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
      .page-header button { width: 100%; justify-content: center; }
      .summary-cards { grid-template-columns: 1fr; }
      .payment-header { flex-direction: column; }
      .payment-amount { text-align: left; }
      .detail-grid { grid-template-columns: 1fr; }
      .payment-actions { flex-direction: column; }
      .payment-actions button { width: 100%; }
    }
  `]
})
export class PaymentHistoryComponent implements OnInit {
  loading = signal(true);

  constructor(private paymentService: PaymentService) {}

  get payments() {
    return this.paymentService.payments();
  }

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.paymentService.getMyPayments().subscribe({
      next: () => this.loading.set(false),
      error: (err) => {
        console.error('Error loading payments:', err);
        this.loading.set(false);
      }
    });
  }

  getTotalPaid(): number {
    return this.payments.reduce((sum, payment) => sum + payment.amount, 0);
  }

  getOnlinePaymentCount(): number {
    return this.payments.filter(p => p.paymentMode === 'Online').length;
  }

  getPaymentModeIcon(mode: string): string {
    const icons: { [key: string]: string } = {
      'Online': 'online_prediction',
      'Cash': 'payments',
      'Cheque': 'receipt_long'
    };
    return icons[mode] || 'payment';
  }

  getPaymentModeClass(mode: string): string {
    return mode.toLowerCase();
  }
}