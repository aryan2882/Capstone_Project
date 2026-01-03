// make-payment.component.ts - Create in features/consumer/payments/

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ConsumerService } from '../../../core/services/consumer';
import { PaymentService } from '../../../core/services/payment';
import { PaymentMode, PaymentMethod } from '../../../core/models/payment';
import { Bill } from '../../../core/models/consumer_new';

@Component({
  selector: 'app-make-payment',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
    <div class="payment-container">
      <div class="page-header">
        <button mat-icon-button routerLink="/consumer/bills">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          <h1><mat-icon>payment</mat-icon> Make Payment</h1>
          <p>Pay your utility bills securely</p>
        </div>
      </div>

      <div *ngIf="loading()" class="loading">
        <mat-spinner></mat-spinner>
      </div>

      <div *ngIf="!loading()" class="payment-content">
        <!-- Step 1: Select Bill -->
        <mat-card class="step-card" *ngIf="currentStep() === 1">
          <mat-card-header>
            <mat-card-title>
              <span class="step-number">1</span>
              Select Bill to Pay
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="unpaidBills.length === 0" class="empty-state">
              <mat-icon>check_circle</mat-icon>
              <h3>All Bills Paid!</h3>
              <p>You have no outstanding bills at the moment.</p>
              <button mat-raised-button color="primary" routerLink="/consumer/bills">
                View All Bills
              </button>
            </div>

            <div *ngIf="unpaidBills.length > 0" class="bills-list">
              <div 
                *ngFor="let bill of unpaidBills" 
                class="bill-card" 
                [class.selected]="selectedBill?.billId === bill.billId"
                (click)="selectBill(bill)">
                <div class="bill-header">
                  <div>
                    <h3>{{bill.billNumber}}</h3>
                    <p>{{bill.cycleName}}</p>
                  </div>
                  <mat-icon>{{bill.utilityTypeName === 'Electricity' ? 'bolt' : 'water_drop'}}</mat-icon>
                </div>
                <div class="bill-details">
                  <div class="detail-row">
                    <span>Utility:</span>
                    <strong>{{bill.utilityTypeName}}</strong>
                  </div>
                  <div class="detail-row">
                    <span>Due Date:</span>
                    <strong>{{bill.dueDate | date:'dd MMM yyyy'}}</strong>
                  </div>
                  <div class="detail-row amount">
                    <span>Amount Due:</span>
                    <strong>₹{{bill.outstandingAmount | number:'1.2-2'}}</strong>
                  </div>
                </div>
                <div class="select-indicator" *ngIf="selectedBill?.billId === bill.billId">
                  <mat-icon>check_circle</mat-icon>
                  Selected
                </div>
              </div>
            </div>

            <div class="step-actions" *ngIf="unpaidBills.length > 0">
              <button mat-raised-button color="primary" [disabled]="!selectedBill" (click)="nextStep()">
                Continue
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Step 2: Select Payment Method -->
        <mat-card class="step-card" *ngIf="currentStep() === 2 && selectedBill">
          <mat-card-header>
            <mat-card-title>
              <span class="step-number">2</span>
              Choose Payment Method
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="selected-bill-summary">
              <h4>Paying for: {{selectedBill.billNumber}}</h4>
              <div class="summary-amount">₹{{selectedBill.outstandingAmount | number:'1.2-2'}}</div>
            </div>

            <div class="payment-methods">
              <div 
                class="method-card" 
                [class.selected]="selectedMethod === 'UPI'"
                (click)="selectMethod('UPI')">
                <mat-icon>qr_code_2</mat-icon>
                <h3>UPI</h3>
                <p>Pay using UPI apps</p>
                <div class="check-icon" *ngIf="selectedMethod === 'UPI'">
                  <mat-icon>check_circle</mat-icon>
                </div>
              </div>

              <div 
                class="method-card" 
                [class.selected]="selectedMethod === 'Card'"
                (click)="selectMethod('Card')">
                <mat-icon>credit_card</mat-icon>
                <h3>Debit/Credit Card</h3>
                <p>Pay using your card</p>
                <div class="check-icon" *ngIf="selectedMethod === 'Card'">
                  <mat-icon>check_circle</mat-icon>
                </div>
              </div>

              <div 
                class="method-card" 
                [class.selected]="selectedMethod === 'NetBanking'"
                (click)="selectMethod('NetBanking')">
                <mat-icon>account_balance</mat-icon>
                <h3>Net Banking</h3>
                <p>Pay via your bank</p>
                <div class="check-icon" *ngIf="selectedMethod === 'NetBanking'">
                  <mat-icon>check_circle</mat-icon>
                </div>
              </div>
            </div>

            <div class="step-actions">
              <button mat-button (click)="previousStep()">
                <mat-icon>arrow_back</mat-icon>
                Back
              </button>
              <button mat-raised-button color="primary" [disabled]="!selectedMethod" (click)="nextStep()">
                Continue
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Step 3: Mock Payment Gateway -->
        <mat-card class="step-card" *ngIf="currentStep() === 3 && selectedBill && selectedMethod">
          <mat-card-header>
            <mat-card-title>
              <span class="step-number">3</span>
              Complete Payment
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="payment-gateway-mock">
              <div class="gateway-header">
                <mat-icon>security</mat-icon>
                <h2>Secure Payment Gateway (Mock)</h2>
                <p>This is a simulated payment - No actual transaction will occur</p>
              </div>

              <div class="payment-summary">
                <h3>Payment Summary</h3>
                <div class="summary-row">
                  <span>Bill Number:</span>
                  <strong>{{selectedBill.billNumber}}</strong>
                </div>
                <div class="summary-row">
                  <span>Utility:</span>
                  <strong>{{selectedBill.utilityTypeName}}</strong>
                </div>
                <div class="summary-row">
                  <span>Payment Method:</span>
                  <strong>{{selectedMethod}}</strong>
                </div>
                <div class="summary-row total">
                  <span>Total Amount:</span>
                  <strong>₹{{selectedBill.outstandingAmount | number:'1.2-2'}}</strong>
                </div>
              </div>

              <!-- Mock Payment Forms -->
              <div class="mock-payment-form" *ngIf="selectedMethod === 'UPI'">
                <mat-icon class="method-icon">qr_code_2</mat-icon>
                <h3>UPI Payment</h3>
                <mat-form-field appearance="outline">
                  <mat-label>Enter UPI ID</mat-label>
                  <input matInput placeholder="yourname@upi" [(ngModel)]="mockUpiId">
                  <mat-icon matSuffix>account_circle</mat-icon>
                </mat-form-field>
                <p class="mock-note">💡 Enter any UPI ID to simulate payment</p>
              </div>

              <div class="mock-payment-form" *ngIf="selectedMethod === 'Card'">
                <mat-icon class="method-icon">credit_card</mat-icon>
                <h3>Card Payment</h3>
                <mat-form-field appearance="outline">
                  <mat-label>Card Number</mat-label>
                  <input matInput placeholder="1234 5678 9012 3456" maxlength="19" [(ngModel)]="mockCardNumber">
                </mat-form-field>
                <div class="card-details-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Expiry (MM/YY)</mat-label>
                    <input matInput placeholder="12/25" [(ngModel)]="mockCardExpiry">
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>CVV</mat-label>
                    <input matInput type="password" placeholder="123" maxlength="3" [(ngModel)]="mockCardCvv">
                  </mat-form-field>
                </div>
                <p class="mock-note">💡 Enter any card details to simulate payment</p>
              </div>

              <div class="mock-payment-form" *ngIf="selectedMethod === 'NetBanking'">
                <mat-icon class="method-icon">account_balance</mat-icon>
                <h3>Net Banking</h3>
                <mat-form-field appearance="outline">
                  <mat-label>Select Bank</mat-label>
                  <mat-select [(ngModel)]="mockBank">
                    <mat-option value="SBI">State Bank of India</mat-option>
                    <mat-option value="HDFC">HDFC Bank</mat-option>
                    <mat-option value="ICICI">ICICI Bank</mat-option>
                    <mat-option value="AXIS">Axis Bank</mat-option>
                  </mat-select>
                </mat-form-field>
                <p class="mock-note">💡 Select any bank to simulate payment</p>
              </div>

              <div class="security-badge">
                <mat-icon>lock</mat-icon>
                <span>Secure 256-bit SSL Encryption</span>
              </div>
            </div>

            <div class="step-actions">
              <button mat-button (click)="previousStep()" [disabled]="processing()">
                <mat-icon>arrow_back</mat-icon>
                Back
              </button>
              <button 
                mat-raised-button 
                color="primary" 
                (click)="processPayment()" 
                [disabled]="processing() || !isPaymentFormValid()">
                <mat-spinner *ngIf="processing()" diameter="20"></mat-spinner>
                <mat-icon *ngIf="!processing()">payment</mat-icon>
                {{processing() ? 'Processing...' : 'Pay ₹' + (selectedBill.outstandingAmount | number:'1.2-2')}}
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .payment-container { max-width: 1000px; margin: 0 auto; }
    .page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
    .page-header h1 { display: flex; align-items: center; gap: 12px; font-size: 28px; margin: 0 0 4px 0; }
    .page-header p { color: #666; margin: 0; }
    .loading { display: flex; justify-content: center; padding: 60px; }
    
    .step-card { margin-bottom: 24px; }
    .step-card mat-card-header { padding: 24px; border-bottom: 1px solid #e0e0e0; }
    .step-card mat-card-title { display: flex; align-items: center; gap: 16px; font-size: 24px; font-weight: 600; margin: 0; }
    .step-number { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 600; }
    .step-card mat-card-content { padding: 24px; }
    
    .empty-state { text-align: center; padding: 60px 20px; }
    .empty-state mat-icon { font-size: 80px; width: 80px; height: 80px; color: #4caf50; opacity: 0.8; }
    .empty-state h3 { margin: 16px 0 8px 0; }
    .empty-state p { color: #666; margin-bottom: 24px; }
    
    .bills-list { display: grid; gap: 16px; }
    .bill-card { border: 2px solid #e0e0e0; border-radius: 12px; padding: 20px; cursor: pointer; transition: all 0.3s ease; position: relative; }
    .bill-card:hover { border-color: #667eea; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2); }
    .bill-card.selected { border-color: #667eea; background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%); }
    
    .bill-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
    .bill-header h3 { margin: 0; font-size: 18px; font-weight: 600; }
    .bill-header p { margin: 4px 0 0 0; color: #666; font-size: 14px; }
    .bill-header mat-icon { font-size: 32px; width: 32px; height: 32px; color: #667eea; }
    
    .bill-details { display: grid; gap: 8px; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
    .detail-row.amount { border-bottom: none; font-size: 18px; color: #667eea; margin-top: 8px; }
    
    .select-indicator { display: flex; align-items: center; gap: 8px; margin-top: 16px; padding: 12px; background-color: #667eea; color: white; border-radius: 8px; font-weight: 600; }
    .select-indicator mat-icon { font-size: 24px; width: 24px; height: 24px; }
    
    .selected-bill-summary { text-align: center; padding: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px; margin-bottom: 32px; }
    .selected-bill-summary h4 { margin: 0 0 12px 0; font-size: 16px; opacity: 0.9; }
    .summary-amount { font-size: 42px; font-weight: 600; }
    
    .payment-methods { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
    .method-card { border: 2px solid #e0e0e0; border-radius: 12px; padding: 32px 24px; text-align: center; cursor: pointer; transition: all 0.3s ease; position: relative; }
    .method-card:hover { border-color: #667eea; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2); transform: translateY(-4px); }
    .method-card.selected { border-color: #667eea; background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%); }
    .method-card mat-icon { font-size: 48px; width: 48px; height: 48px; color: #667eea; margin-bottom: 12px; }
    .method-card h3 { margin: 0 0 8px 0; font-size: 18px; }
    .method-card p { margin: 0; color: #666; font-size: 14px; }
    .check-icon { position: absolute; top: 12px; right: 12px; }
    .check-icon mat-icon { font-size: 28px; width: 28px; height: 28px; color: #4caf50; }
    
    .payment-gateway-mock { }
    .gateway-header { text-align: center; padding: 24px; background-color: #f8f9fa; border-radius: 12px; margin-bottom: 24px; }
    .gateway-header mat-icon { font-size: 48px; width: 48px; height: 48px; color: #4caf50; }
    .gateway-header h2 { margin: 12px 0 8px 0; font-size: 24px; }
    .gateway-header p { margin: 0; color: #666; }
    
    .payment-summary { padding: 24px; background-color: #fff; border: 1px solid #e0e0e0; border-radius: 12px; margin-bottom: 24px; }
    .payment-summary h3 { margin: 0 0 16px 0; font-size: 18px; }
    .summary-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
    .summary-row.total { border-top: 2px solid #e0e0e0; border-bottom: none; font-size: 20px; font-weight: 600; color: #667eea; margin-top: 8px; padding-top: 16px; }
    
    .mock-payment-form { text-align: center; margin-bottom: 24px; }
    .method-icon { font-size: 64px; width: 64px; height: 64px; color: #667eea; margin-bottom: 16px; }
    .mock-payment-form h3 { margin: 0 0 24px 0; font-size: 20px; }
    .mock-payment-form mat-form-field { width: 100%; max-width: 400px; }
    .card-details-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; max-width: 400px; margin: 0 auto; }
    .mock-note { margin: 16px 0 0 0; padding: 12px; background-color: #fff3cd; border-radius: 8px; color: #856404; font-size: 14px; }
    
    .security-badge { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; background-color: #e8f5e9; color: #2e7d32; border-radius: 8px; font-weight: 500; }
    .security-badge mat-icon { font-size: 20px; width: 20px; height: 20px; }
    
    .step-actions { display: flex; justify-content: space-between; gap: 12px; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e0e0e0; }
    .step-actions button { display: flex; align-items: center; gap: 8px; }
    
    @media (max-width: 768px) {
      .payment-methods { grid-template-columns: 1fr; }
      .card-details-row { grid-template-columns: 1fr; }
      .step-actions { flex-direction: column; }
      .step-actions button { width: 100%; justify-content: center; }
    }
  `]
})
export class MakePaymentComponent implements OnInit {
  loading = signal(true);
  processing = signal(false);
  currentStep = signal(1);
  
  selectedBill: Bill | null = null;
  selectedMethod: string = '';
  
  // Mock payment form data
  mockUpiId = '';
  mockCardNumber = '';
  mockCardExpiry = '';
  mockCardCvv = '';
  mockBank = '';

  constructor(
    private consumerService: ConsumerService,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  get unpaidBills() {
    return this.consumerService.unpaidBills();
  }

  ngOnInit(): void {
    this.loadBills();
    
    // Check if billId is passed in query params
    this.route.queryParams.subscribe(params => {
      if (params['billId']) {
        const billId = +params['billId'];
        // Will auto-select after bills load
        setTimeout(() => {
          const bill = this.unpaidBills.find(b => b.billId === billId);
          if (bill) {
            this.selectBill(bill);
          }
        }, 500);
      }
    });
  }

  loadBills(): void {
    const profile = this.consumerService.profile();
    if (profile) {
      this.consumerService.getMyBills(profile.consumerId).subscribe({
        next: () => this.loading.set(false),
        error: () => this.loading.set(false)
      });
    } else {
      this.consumerService.loadAllConsumerData().subscribe({
        next: () => this.loading.set(false),
        error: () => this.loading.set(false)
      });
    }
  }

  selectBill(bill: Bill): void {
    this.selectedBill = bill;
  }

  selectMethod(method: string): void {
    this.selectedMethod = method;
  }

  nextStep(): void {
    this.currentStep.set(this.currentStep() + 1);
  }

  previousStep(): void {
    this.currentStep.set(this.currentStep() - 1);
  }

  isPaymentFormValid(): boolean {
    switch (this.selectedMethod) {
      case 'UPI':
        return this.mockUpiId.length > 0;
      case 'Card':
        return this.mockCardNumber.length > 0 && this.mockCardExpiry.length > 0 && this.mockCardCvv.length > 0;
      case 'NetBanking':
        return this.mockBank.length > 0;
      default:
        return false;
    }
  }

  processPayment(): void {
    if (!this.selectedBill || !this.selectedMethod) return;

    this.processing.set(true);

    const paymentRequest = {
      billId: this.selectedBill.billId,
      amount: this.selectedBill.outstandingAmount,
      paymentMode: PaymentMode.Online,
      paymentMethod: this.selectedMethod
    };

    // Simulate payment processing delay
    setTimeout(() => {
      this.paymentService.makeOnlinePayment(paymentRequest).subscribe({
        next: (response) => {
          this.processing.set(false);
          this.snackBar.open('Payment Successful! 🎉', 'Close', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          
          // Reload bills to update status
          const profile = this.consumerService.profile();
          if (profile) {
            this.consumerService.getMyBills(profile.consumerId).subscribe();
          }
          
          // Navigate to payment history or success page
          setTimeout(() => {
            this.router.navigate(['/consumer/payment-history']);
          }, 2000);
        },
        error: (err) => {
          this.processing.set(false);
          console.error('Payment error:', err);
          this.snackBar.open('Payment failed. Please try again.', 'Close', {
            duration: 5000
          });
        }
      });
    }, 2000); // 2 second mock delay
  }
}