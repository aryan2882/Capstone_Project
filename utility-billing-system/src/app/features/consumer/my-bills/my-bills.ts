// my-bills.component.ts - Updated with Signals

import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { ConsumerService } from '../../../core/services/consumer';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-bills',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    RouterModule
  ],
  template: `
    <div class="bills-container">
      <div class="page-header">
        <h1><mat-icon>receipt</mat-icon> My Bills</h1>
        <p>View and manage all your utility bills</p>
      </div>

      <div *ngIf="loading()" class="loading">
        <mat-spinner></mat-spinner>
      </div>

      <mat-card *ngIf="!loading()">
        <mat-card-content>
          <mat-tab-group>
            <mat-tab label="All Bills ({{bills.length}})">
              <div class="bills-list">
                <div *ngIf="bills.length === 0" class="empty-state">
                  <mat-icon>inbox</mat-icon>
                  <p>No bills found</p>
                </div>
                <div *ngFor="let bill of bills" class="bill-card">
                  <div class="bill-header">
                    <div>
                      <h3>{{bill.billNumber}}</h3>
                      <p class="cycle-name">{{bill.cycleName}}</p>
                    </div>
                    <mat-chip [class]="getBillStatusClass(bill.status)">
                      {{bill.status}}
                    </mat-chip>
                  </div>
                  
                  <div class="bill-body">
                    <div class="bill-info-grid">
                      <div class="info-item">
                        <mat-icon>{{bill.utilityTypeName === 'Electricity' ? 'bolt' : 'water_drop'}}</mat-icon>
                        <div>
                          <span class="label">Utility Type</span>
                          <span class="value">{{bill.utilityTypeName}}</span>
                        </div>
                      </div>
                      <div class="info-item">
                        <mat-icon>speed</mat-icon>
                        <div>
                          <span class="label">Meter Number</span>
                          <span class="value">{{bill.meterNumber}}</span>
                        </div>
                      </div>
                      <div class="info-item">
                        <mat-icon>show_chart</mat-icon>
                        <div>
                          <span class="label">Consumption</span>
                          <span class="value">{{bill.consumption}} units</span>
                        </div>
                      </div>
                      <div class="info-item">
                        <mat-icon>event</mat-icon>
                        <div>
                          <span class="label">Due Date</span>
                          <span class="value">{{bill.dueDate | date:'dd MMM yyyy'}}</span>
                        </div>
                      </div>
                    </div>

                    <div class="bill-amounts">
                      <div class="amount-row">
                        <span>Energy Charge:</span>
                        <span>₹{{bill.energyCharge | number:'1.2-2'}}</span>
                      </div>
                      <div class="amount-row">
                        <span>Fixed Charge:</span>
                        <span>₹{{bill.fixedCharge | number:'1.2-2'}}</span>
                      </div>
                      <div class="amount-row" *ngIf="bill.previousOutstanding > 0">
                        <span>Previous Outstanding:</span>
                        <span class="outstanding">₹{{bill.previousOutstanding | number:'1.2-2'}}</span>
                      </div>
                      <div class="amount-row">
                        <span>Tax:</span>
                        <span>₹{{bill.taxAmount | number:'1.2-2'}}</span>
                      </div>
                      <div class="amount-row" *ngIf="bill.penaltyAmount > 0">
                        <span>Penalty:</span>
                        <span class="penalty">₹{{bill.penaltyAmount | number:'1.2-2'}}</span>
                      </div>
                      <div class="amount-row total">
                        <span>Total Amount:</span>
                        <span>₹{{bill.totalAmount | number:'1.2-2'}}</span>
                      </div>
                      <div class="amount-row" *ngIf="bill.paidAmount > 0">
                        <span>Paid Amount:</span>
                        <span class="paid">₹{{bill.paidAmount | number:'1.2-2'}}</span>
                      </div>
                      <div class="amount-row outstanding-row" *ngIf="bill.outstandingAmount > 0">
                        <span>Outstanding:</span>
                        <span>₹{{bill.outstandingAmount | number:'1.2-2'}}</span>
                      </div>
                    </div>
                  </div>

                  <div class="bill-actions" *ngIf="bill.outstandingAmount > 0">
                    <button mat-raised-button color="primary" [routerLink]="['/consumer/make-payment']" [queryParams]="{billId: bill.billId}">
                      <mat-icon>payment</mat-icon>
                      Pay ₹{{bill.outstandingAmount | number:'1.2-2'}}
                    </button>
                    <button mat-button>
                      <mat-icon>download</mat-icon>
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </mat-tab>

            <mat-tab label="Unpaid ({{unpaidBills.length}})">
              <div class="bills-list">
                <div *ngIf="unpaidBills.length === 0" class="empty-state">
                  <mat-icon>check_circle</mat-icon>
                  <p>All bills are paid!</p>
                </div>
                <div *ngFor="let bill of unpaidBills" class="bill-card">
                  <div class="bill-header">
                    <div>
                      <h3>{{bill.billNumber}}</h3>
                      <p class="cycle-name">{{bill.cycleName}}</p>
                    </div>
                    <mat-chip [class]="getBillStatusClass(bill.status)">{{bill.status}}</mat-chip>
                  </div>
                  <div class="bill-body">
                    <div class="bill-info-grid">
                      <div class="info-item">
                        <mat-icon>{{bill.utilityTypeName === 'Electricity' ? 'bolt' : 'water_drop'}}</mat-icon>
                        <div>
                          <span class="label">Utility Type</span>
                          <span class="value">{{bill.utilityTypeName}}</span>
                        </div>
                      </div>
                      <div class="info-item">
                        <mat-icon>event</mat-icon>
                        <div>
                          <span class="label">Due Date</span>
                          <span class="value">{{bill.dueDate | date:'dd MMM yyyy'}}</span>
                        </div>
                      </div>
                    </div>
                    <div class="bill-amounts">
                      <div class="amount-row outstanding-row">
                        <span>Outstanding Amount:</span>
                        <span>₹{{bill.outstandingAmount | number:'1.2-2'}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="bill-actions">
                    <button mat-raised-button color="primary" [routerLink]="['/consumer/make-payment']" [queryParams]="{billId: bill.billId}">
                      <mat-icon>payment</mat-icon>
                      Pay Now
                    </button>
                  </div>
                </div>
              </div>
            </mat-tab>

            <mat-tab label="Paid ({{paidBills.length}})">
              <div class="bills-list">
                <div *ngIf="paidBills.length === 0" class="empty-state">
                  <mat-icon>inbox</mat-icon>
                  <p>No paid bills</p>
                </div>
                <div *ngFor="let bill of paidBills" class="bill-card paid">
                  <div class="bill-header">
                    <div>
                      <h3>{{bill.billNumber}}</h3>
                      <p class="cycle-name">{{bill.cycleName}}</p>
                    </div>
                    <mat-chip class="status-paid">Paid</mat-chip>
                  </div>
                  <div class="bill-body">
                    <div class="bill-info-grid">
                      <div class="info-item">
                        <mat-icon>{{bill.utilityTypeName === 'Electricity' ? 'bolt' : 'water_drop'}}</mat-icon>
                        <div>
                          <span class="label">Utility Type</span>
                          <span class="value">{{bill.utilityTypeName}}</span>
                        </div>
                      </div>
                      <div class="info-item">
                        <mat-icon>check_circle</mat-icon>
                        <div>
                          <span class="label">Payment Date</span>
                          <span class="value">{{bill.paymentDate | date:'dd MMM yyyy'}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .bills-container { max-width: 1200px; margin: 0 auto; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { display: flex; align-items: center; gap: 12px; font-size: 28px; margin: 0 0 8px 0; }
    .page-header p { color: #666; margin: 0; }
    .loading { display: flex; justify-content: center; padding: 40px; }
    .bills-list { padding: 24px 0; display: flex; flex-direction: column; gap: 20px; }
    .empty-state { text-align: center; padding: 60px 20px; color: #999; }
    .empty-state mat-icon { font-size: 80px; width: 80px; height: 80px; opacity: 0.3; }
    .empty-state p { font-size: 18px; margin-top: 16px; }
    .bill-card { border: 1px solid #e0e0e0; border-radius: 12px; padding: 24px; transition: all 0.3s ease; }
    .bill-card:hover { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
    .bill-card.paid { opacity: 0.8; }
    .bill-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #f0f0f0; }
    .bill-header h3 { margin: 0; font-size: 20px; font-weight: 600; }
    .cycle-name { margin: 4px 0 0 0; color: #666; font-size: 14px; }
    .bill-info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px; }
    .info-item { display: flex; gap: 12px; }
    .info-item mat-icon { color: #667eea; font-size: 24px; width: 24px; height: 24px; }
    .info-item div { display: flex; flex-direction: column; }
    .label { font-size: 12px; color: #999; margin-bottom: 4px; }
    .value { font-weight: 500; font-size: 14px; }
    .bill-amounts { background-color: #f8f9fa; padding: 16px; border-radius: 8px; margin-bottom: 16px; }
    .amount-row { display: flex; justify-content: space-between; padding: 8px 0; }
    .amount-row.total { font-weight: 600; font-size: 18px; border-top: 2px solid #ddd; margin-top: 8px; padding-top: 12px; }
    .amount-row.outstanding-row { background-color: #fff3cd; padding: 12px; margin: 8px -16px -16px -16px; border-radius: 0 0 8px 8px; font-weight: 600; color: #856404; }
    .outstanding { color: #f5576c; }
    .penalty { color: #f44336; }
    .paid { color: #4caf50; }
    .bill-actions { display: flex; gap: 12px; justify-content: flex-end; }
    .bill-actions button { display: flex; align-items: center; gap: 8px; }
    mat-chip.status-generated { background-color: #ffc107; color: #000; }
    mat-chip.status-partial { background-color: #ff9800; color: #fff; }
    mat-chip.status-paid { background-color: #4caf50; color: #fff; }
    mat-chip.status-overdue { background-color: #f44336; color: #fff; }
    @media (max-width: 768px) {
      .bill-info-grid { grid-template-columns: 1fr; }
      .bill-actions { flex-direction: column; }
      .bill-actions button { width: 100%; }
    }
  `]
})
export class MyBillsComponent implements OnInit {
  loading = signal(true);
  
  constructor(private consumerService: ConsumerService) {}
  
  // Use getters to access service signals
  get bills() {
    return this.consumerService.bills();
  }
  
  get unpaidBills() {
    return this.consumerService.unpaidBills();
  }
  
  get paidBills() {
    return this.consumerService.paidBills();
  }

  ngOnInit(): void {
    this.loadBills();
  }

  loadBills(): void {
    const profile = this.consumerService.profile();
    
    if (profile) {
      // If profile is already loaded, just get bills
      this.consumerService.getMyBills(profile.consumerId).subscribe({
        next: () => this.loading.set(false),
        error: (err) => {
          console.error('Error loading bills:', err);
          this.loading.set(false);
        }
      });
    } else {
      // If profile not loaded, load everything
      this.consumerService.loadAllConsumerData().subscribe({
        next: () => this.loading.set(false),
        error: (err) => {
          console.error('Error loading data:', err);
          this.loading.set(false);
        }
      });
    }
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
}