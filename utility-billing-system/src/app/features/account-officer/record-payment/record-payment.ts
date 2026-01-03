// record-payment.component.ts

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AccountOfficerService } from '../../../core/services/account-officer';
import { OfflinePaymentMode } from '../../../core/models/account-officer';

@Component({
  selector: 'app-record-payment',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="payment-container">
      <div class="page-header">
        <button mat-icon-button routerLink="/account-officer/outstanding">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          <h1><mat-icon>add_circle</mat-icon> Record Offline Payment</h1>
          <p>Record cash, cheque, or bank transfer payments</p>
        </div>
      </div>

      <div *ngIf="loading()" class="loading">
        <mat-spinner></mat-spinner>
      </div>

      <div *ngIf="!loading()" class="payment-content">
        <form [formGroup]="paymentForm" (ngSubmit)="onSubmit()">
          <!-- Step 1: Select Consumer -->
          <mat-card class="step-card">
            <mat-card-header>
              <mat-card-title>
                <span class="step-number">1</span>
                Select Consumer
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <mat-form-field appearance="outline">
                <mat-label>Consumer</mat-label>
                <mat-select formControlName="consumerId" (selectionChange)="onConsumerChange()">
                  <mat-option *ngFor="let consumer of consumers" [value]="consumer.consumerId">
                    {{consumer.firstName}} {{consumer.lastName}} ({{consumer.consumerCode}})
                  </mat-option>
                </mat-select>
                <mat-icon matPrefix>person</mat-icon>
                <mat-error *ngIf="paymentForm.get('consumerId')?.hasError('required')">
                  Please select a consumer
                </mat-error>
              </mat-form-field>
            </mat-card-content>
          </mat-card>

          <!-- Step 2: Select Bill -->
          <mat-card class="step-card" *ngIf="selectedConsumerId">
            <mat-card-header>
              <mat-card-title>
                <span class="step-number">2</span>
                Select Bill to Pay
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div *ngIf="loadingBills()" class="loading-small">
                <mat-spinner diameter="40"></mat-spinner>
                <p>Loading bills...</p>
              </div>

              <div *ngIf="!loadingBills() && consumerBills.length === 0" class="empty-state-small">
                <mat-icon>check_circle</mat-icon>
                <p>No outstanding bills for this consumer!</p>
              </div>

              <div *ngIf="!loadingBills() && consumerBills.length > 0" class="bills-list">
                <div *ngFor="let bill of consumerBills" 
                     class="bill-card" 
                     [class.selected]="paymentForm.get('billId')?.value === bill.billId"
                     (click)="selectBill(bill)">
                  <div class="bill-header">
                    <div>
                      <h3>{{bill.billNumber}}</h3>
                      <p>{{bill.utilityTypeName}} - {{bill.meterNumber}}</p>
                    </div>
                    <mat-icon>{{bill.utilityTypeName === 'Electricity' ? 'bolt' : 'water_drop'}}</mat-icon>
                  </div>
                  <div class="bill-details">
                    <div class="detail-row">
                      <span>Total Amount:</span>
                      <strong>₹{{bill.totalAmount | number:'1.2-2'}}</strong>
                    </div>
                    <div class="detail-row">
                      <span>Paid:</span>
                      <strong class="paid">₹{{bill.paidAmount | number:'1.2-2'}}</strong>
                    </div>
                    <div class="detail-row outstanding">
                      <span>Outstanding:</span>
                      <strong>₹{{bill.outstandingAmount | number:'1.2-2'}}</strong>
                    </div>
                  </div>
                  <div class="select-indicator" *ngIf="paymentForm.get('billId')?.value === bill.billId">
                    <mat-icon>check_circle</mat-icon>
                    Selected
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Step 3: Payment Details -->
          <mat-card class="step-card" *ngIf="paymentForm.get('billId')?.value">
            <mat-card-header>
              <mat-card-title>
                <span class="step-number">3</span>
                Payment Details
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="form-grid">
                <mat-form-field appearance="outline">
                  <mat-label>Payment Mode</mat-label>
                  <mat-select formControlName="paymentMode">
                    <mat-option [value]="1">Cash</mat-option>
                    <mat-option [value]="3">Cheque</mat-option>
                    <mat-option [value]="4">Bank Transfer (NEFT/RTGS)</mat-option>
                    <mat-option [value]="5">Demand Draft</mat-option>
                  </mat-select>
                  <mat-icon matPrefix>payment</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Amount</mat-label>
                  <input matInput type="number" formControlName="amount" placeholder="0.00">
                  <span matPrefix>₹&nbsp;</span>
                  <mat-error *ngIf="paymentForm.get('amount')?.hasError('required')">
                    Amount is required
                  </mat-error>
                  <mat-error *ngIf="paymentForm.get('amount')?.hasError('min')">
                    Amount must be greater than 0
                  </mat-error>
                  <mat-error *ngIf="paymentForm.get('amount')?.hasError('max')">
                    Amount cannot exceed outstanding amount
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Payment Date</mat-label>
                  <input matInput [matDatepicker]="picker" formControlName="paymentDate">
                  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Remarks</mat-label>
                  <textarea matInput rows="3" formControlName="remarks" 
                            placeholder="Enter payment details, cheque number, transaction ID, etc."></textarea>
                  <mat-icon matPrefix>notes</mat-icon>
                </mat-form-field>
              </div>

              <div class="payment-summary" *ngIf="selectedBill">
                <h3>Payment Summary</h3>
                <div class="summary-row">
                  <span>Bill Number:</span>
                  <strong>{{selectedBill.billNumber}}</strong>
                </div>
                <div class="summary-row">
                  <span>Outstanding Amount:</span>
                  <strong>₹{{selectedBill.outstandingAmount | number:'1.2-2'}}</strong>
                </div>
                <div class="summary-row">
                  <span>Payment Amount:</span>
                  <strong class="highlight">₹{{paymentForm.get('amount')?.value || 0 | number:'1.2-2'}}</strong>
                </div>
                <div class="summary-row total">
                  <span>Remaining Balance:</span>
                  <strong>₹{{getRemainingBalance() | number:'1.2-2'}}</strong>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Submit -->
          <div class="form-actions" *ngIf="paymentForm.get('billId')?.value">
            <button mat-button type="button" routerLink="/account-officer/outstanding">
              Cancel
            </button>
            <button mat-raised-button color="primary" type="submit" [disabled]="!paymentForm.valid || processing()">
              <mat-spinner *ngIf="processing()" diameter="20"></mat-spinner>
              <mat-icon *ngIf="!processing()">check_circle</mat-icon>
              {{processing() ? 'Recording...' : 'Record Payment'}}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .payment-container { max-width: 1000px; margin: 0 auto; }
    .page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
    .page-header h1 { display: flex; align-items: center; gap: 12px; font-size: 28px; margin: 0 0 4px 0; }
    .page-header p { color: #666; margin: 0; }
    
    .loading { display: flex; justify-content: center; padding: 60px; }
    .loading-small { display: flex; flex-direction: column; align-items: center; padding: 40px; }
    .loading-small p { margin-top: 16px; color: #666; }
    .empty-state-small { text-align: center; padding: 40px; color: #999; }
    .empty-state-small mat-icon { font-size: 64px; width: 64px; height: 64px; opacity: 0.5; }
    
    .step-card { margin-bottom: 24px; }
    .step-card mat-card-header { padding: 24px; border-bottom: 1px solid #e0e0e0; }
    .step-card mat-card-title { display: flex; align-items: center; gap: 16px; font-size: 20px; font-weight: 600; margin: 0; }
    .step-number { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 600; }
    .step-card mat-card-content { padding: 24px; }
    
    mat-form-field { width: 100%; }
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .form-grid .full-width { grid-column: 1 / -1; }
    
    .bills-list { display: grid; gap: 16px; }
    .bill-card { border: 2px solid #e0e0e0; border-radius: 12px; padding: 20px; cursor: pointer; transition: all 0.3s ease; }
    .bill-card:hover { border-color: #667eea; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2); }
    .bill-card.selected { border-color: #667eea; background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%); }
    
    .bill-header { display: flex; justify-content: space-between; margin-bottom: 16px; }
    .bill-header h3 { margin: 0; font-size: 18px; font-weight: 600; }
    .bill-header p { margin: 4px 0 0 0; color: #666; font-size: 14px; }
    .bill-header mat-icon { font-size: 32px; width: 32px; height: 32px; color: #667eea; }
    
    .bill-details { display: grid; gap: 8px; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
    .detail-row.outstanding { border-bottom: none; font-size: 16px; color: #f5576c; margin-top: 4px; }
    .paid { color: #4caf50; }
    
    .select-indicator { display: flex; align-items: center; gap: 8px; margin-top: 16px; padding: 12px; background-color: #667eea; color: white; border-radius: 8px; font-weight: 600; }
    .select-indicator mat-icon { font-size: 24px; width: 24px; height: 24px; }
    
    .payment-summary { margin-top: 24px; padding: 20px; background-color: #f8f9fa; border-radius: 12px; }
    .payment-summary h3 { margin: 0 0 16px 0; font-size: 18px; }
    .summary-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e0e0e0; }
    .summary-row.total { border-top: 2px solid #ddd; border-bottom: none; font-size: 18px; font-weight: 600; color: #667eea; margin-top: 8px; }
    .highlight { color: #667eea; }
    
    .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
    .form-actions button { display: flex; align-items: center; gap: 8px; }
    
    @media (max-width: 768px) {
      .form-grid { grid-template-columns: 1fr; }
      .form-actions { flex-direction: column; }
      .form-actions button { width: 100%; justify-content: center; }
    }
  `]
})
export class RecordPaymentComponent implements OnInit {
  loading = signal(true);
  loadingBills = signal(false);
  processing = signal(false);
  
  paymentForm: FormGroup;
  selectedConsumerId: number | null = null;
  consumerBills: any[] = [];
  selectedBill: any = null;

  constructor(
    private fb: FormBuilder,
    private aoService: AccountOfficerService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.paymentForm = this.fb.group({
      consumerId: ['', Validators.required],
      billId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      paymentMode: [1, Validators.required],
      paymentDate: [new Date(), Validators.required],
      remarks: ['', Validators.required]
    });
  }

  get consumers() {
    return this.aoService.consumers();
  }

  ngOnInit(): void {
    this.loadData();
    
    // Check for pre-selected bill
    this.route.queryParams.subscribe(params => {
      if (params['billId']) {
        // Load bill details and pre-select
        setTimeout(() => this.preselectBill(+params['billId']), 500);
      }
    });
  }

  loadData(): void {
    this.aoService.getAllConsumers().subscribe({
      next: () => this.loading.set(false),
      error: (err) => {
        console.error('Error loading data:', err);
        this.loading.set(false);
      }
    });
  }

  onConsumerChange(): void {
    const consumerId = this.paymentForm.get('consumerId')?.value;
    if (consumerId) {
      this.selectedConsumerId = consumerId;
      this.loadConsumerBills(consumerId);
    }
  }

  loadConsumerBills(consumerId: number): void {
    this.loadingBills.set(true);
    this.aoService.getBillsByConsumer(consumerId).subscribe({
      next: (bills) => {
        this.consumerBills = bills.filter(b => b.outstandingAmount > 0);
        this.loadingBills.set(false);
      },
      error: (err) => {
        console.error('Error loading bills:', err);
        this.loadingBills.set(false);
      }
    });
  }

  selectBill(bill: any): void {
    this.selectedBill = bill;
    this.paymentForm.patchValue({
      billId: bill.billId,
      amount: bill.outstandingAmount
    });
    
    // Set max validator for amount
    this.paymentForm.get('amount')?.setValidators([
      Validators.required,
      Validators.min(0.01),
      Validators.max(bill.outstandingAmount)
    ]);
    this.paymentForm.get('amount')?.updateValueAndValidity();
  }

  preselectBill(billId: number): void {
    // Find bill in outstanding bills
    const bill = this.aoService.outstandingBills().find(b => b.billId === billId);
    if (bill) {
      this.paymentForm.patchValue({ consumerId: bill.consumerId });
      this.selectedConsumerId = bill.consumerId;
      this.loadConsumerBills(bill.consumerId);
      setTimeout(() => {
        const foundBill = this.consumerBills.find(b => b.billId === billId);
        if (foundBill) this.selectBill(foundBill);
      }, 500);
    }
  }

  getRemainingBalance(): number {
    if (!this.selectedBill) return 0;
    const amount = this.paymentForm.get('amount')?.value || 0;
    return this.selectedBill.outstandingAmount - amount;
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      this.processing.set(true);
      
      const request = {
        billId: this.paymentForm.value.billId,
        amount: this.paymentForm.value.amount,
        paymentMode: this.paymentForm.value.paymentMode,
        paymentDate: this.paymentForm.value.paymentDate.toISOString(),
        remarks: this.paymentForm.value.remarks
      };

      this.aoService.recordOfflinePayment(request).subscribe({
        next: (response) => {
          this.processing.set(false);
          this.snackBar.open('Payment recorded successfully! 🎉', 'Close', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          
          // Reload outstanding bills
          this.aoService.getOutstandingBills().subscribe();
          
          setTimeout(() => {
            this.router.navigate(['/account-officer/payments']);
          }, 2000);
        },
        error: (err) => {
          this.processing.set(false);
          console.error('Error recording payment:', err);
          this.snackBar.open('Error recording payment. Please try again.', 'Close', {
            duration: 5000
          });
        }
      });
    }
  }
}