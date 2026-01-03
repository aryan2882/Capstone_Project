// bills.component.ts

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
import { MatTabsModule } from '@angular/material/tabs';
import { AccountOfficerService } from '../../../core/services/account-officer';
import { Bill } from '../../../core/models/account-officer';

@Component({
  selector: 'app-bills',
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
    MatSelectModule,
    MatTabsModule
  ],
  template: `
    <div class="bills-container">
      <div class="page-header">
        <div>
          <h1><mat-icon>receipt</mat-icon> All Bills</h1>
          <p>View and manage all utility bills</p>
        </div>
      </div>

      <div *ngIf="loading()" class="loading">
        <mat-spinner></mat-spinner>
      </div>

      <div *ngIf="!loading()">
        <!-- Summary -->
        <div class="summary-cards">
          <mat-card class="summary-card">
            <mat-icon>receipt</mat-icon>
            <div>
              <h3>{{allBills.length}}</h3>
              <p>Total Bills</p>
            </div>
          </mat-card>
          <mat-card class="summary-card">
            <mat-icon>check_circle</mat-icon>
            <div>
              <h3>{{paidBills.length}}</h3>
              <p>Paid Bills</p>
            </div>
          </mat-card>
          <mat-card class="summary-card">
            <mat-icon>warning</mat-icon>
            <div>
              <h3>{{unpaidBills.length}}</h3>
              <p>Unpaid/Partial</p>
            </div>
          </mat-card>
        </div>

        <!-- Filters -->
        <mat-card class="filters-card">
          <div class="filters">
            <mat-form-field appearance="outline">
              <mat-label>Search</mat-label>
              <input matInput placeholder="Bill number, consumer..." [(ngModel)]="searchTerm" (ngModelChange)="applyFilters()">
              <mat-icon matPrefix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Utility Type</mat-label>
              <mat-select [(ngModel)]="utilityFilter" (selectionChange)="applyFilters()">
                <mat-option value="">All</mat-option>
                <mat-option value="Electricity">Electricity</mat-option>
                <mat-option value="Water">Water</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-raised-button (click)="clearFilters()">
              <mat-icon>clear</mat-icon>
              Clear
            </button>
          </div>
        </mat-card>

        <!-- Bills Tabs -->
        <mat-card>
          <mat-tab-group>
            <mat-tab label="All Bills ({{filteredBills.length}})">
              <div class="bills-list">
                <ng-container *ngTemplateOutlet="billsTemplate; context: {bills: filteredBills}"></ng-container>
              </div>
            </mat-tab>

            <mat-tab label="Unpaid ({{filteredUnpaidBills.length}})">
              <div class="bills-list">
                <ng-container *ngTemplateOutlet="billsTemplate; context: {bills: filteredUnpaidBills}"></ng-container>
              </div>
            </mat-tab>

            <mat-tab label="Paid ({{filteredPaidBills.length}})">
              <div class="bills-list">
                <ng-container *ngTemplateOutlet="billsTemplate; context: {bills: filteredPaidBills}"></ng-container>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card>
      </div>
    </div>

    <!-- Bills Template -->
    <ng-template #billsTemplate let-bills="bills">
      <div *ngIf="bills.length === 0" class="empty-state">
        <mat-icon>inbox</mat-icon>
        <p>No bills found</p>
      </div>

      <div *ngFor="let bill of bills" class="bill-card">
        <div class="bill-header">
          <div>
            <h3>{{bill.billNumber}}</h3>
            <p>{{bill.consumerName}} ({{bill.consumerCode}})</p>
          </div>
          <mat-chip [class]="getBillStatusClass(bill.status)">
            {{bill.status}}
          </mat-chip>
        </div>

        <div class="bill-body">
          <div class="bill-info-grid">
            <div class="info-item">
              <mat-icon>{{getUtilityIcon(bill.utilityTypeName)}}</mat-icon>
              <div>
                <span class="label">Utility</span>
                <span class="value">{{bill.utilityTypeName}}</span>
              </div>
            </div>
            <div class="info-item">
              <mat-icon>speed</mat-icon>
              <div>
                <span class="label">Meter</span>
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
              <span>Total:</span>
              <span>₹{{bill.totalAmount | number:'1.2-2'}}</span>
            </div>
            <div class="amount-row">
              <span>Paid:</span>
              <span class="paid">₹{{bill.paidAmount | number:'1.2-2'}}</span>
            </div>
            <div class="amount-row outstanding" *ngIf="bill.outstandingAmount > 0">
              <span>Outstanding:</span>
              <span>₹{{bill.outstandingAmount | number:'1.2-2'}}</span>
            </div>
          </div>
        </div>

        <div class="bill-actions" *ngIf="bill.outstandingAmount > 0">
          <button mat-raised-button color="primary" 
                  [routerLink]="['/account-officer/make-payment']" 
                  [queryParams]="{billId: bill.billId}">
            <mat-icon>payment</mat-icon>
            Record Payment
          </button>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    .bills-container { max-width: 1200px; margin: 0 auto; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { display: flex; align-items: center; gap: 12px; font-size: 28px; margin: 0 0 4px 0; }
    .page-header p { color: #666; margin: 0; }
    
    .loading { display: flex; justify-content: center; padding: 60px; }
    
    .summary-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 24px; }
    .summary-card { display: flex; align-items: center; gap: 16px; padding: 24px; }
    .summary-card mat-icon { font-size: 48px; width: 48px; height: 48px; color: #667eea; }
    .summary-card h3 { margin: 0; font-size: 28px; font-weight: 600; }
    .summary-card p { margin: 4px 0 0 0; color: #666; font-size: 14px; }
    
    .filters-card { padding: 24px; margin-bottom: 24px; }
    .filters { display: grid; grid-template-columns: 2fr 1fr auto; gap: 16px; align-items: center; }
    .filters mat-form-field { width: 100%; }
    
    .bills-list { padding: 24px 0; display: flex; flex-direction: column; gap: 20px; }
    .empty-state { text-align: center; padding: 60px 20px; color: #999; }
    .empty-state mat-icon { font-size: 80px; width: 80px; height: 80px; opacity: 0.3; }
    
    .bill-card { border: 1px solid #e0e0e0; border-radius: 12px; padding: 24px; transition: all 0.3s ease; }
    .bill-card:hover { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
    
    .bill-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #f0f0f0; }
    .bill-header h3 { margin: 0; font-size: 18px; font-weight: 600; }
    .bill-header p { margin: 4px 0 0 0; color: #666; font-size: 14px; }
    
    .bill-info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px; }
    .info-item { display: flex; gap: 12px; }
    .info-item mat-icon { color: #667eea; font-size: 24px; width: 24px; height: 24px; }
    .info-item div { display: flex; flex-direction: column; }
    .label { font-size: 12px; color: #999; margin-bottom: 4px; }
    .value { font-weight: 500; font-size: 14px; }
    
    .bill-amounts { background-color: #f8f9fa; padding: 16px; border-radius: 8px; margin-bottom: 16px; }
    .amount-row { display: flex; justify-content: space-between; padding: 8px 0; }
    .amount-row.outstanding { background-color: #fff3cd; padding: 12px; margin: 8px -16px -16px -16px; border-radius: 0 0 8px 8px; font-weight: 600; color: #856404; }
    .paid { color: #4caf50; }
    
    .bill-actions { display: flex; justify-content: flex-end; }
    .bill-actions button { display: flex; align-items: center; gap: 8px; }
    
    mat-chip.status-generated { background-color: #ffc107; color: #000; }
    mat-chip.status-partial { background-color: #ff9800; color: #fff; }
    mat-chip.status-paid { background-color: #4caf50; color: #fff; }
    
    @media (max-width: 768px) {
      .filters { grid-template-columns: 1fr; }
      .summary-cards { grid-template-columns: 1fr; }
      .bill-info-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class BillsComponent implements OnInit {
  loading = signal(true);
  searchTerm = '';
  utilityFilter = '';

  constructor(
    private aoService: AccountOfficerService,
    private route: ActivatedRoute
  ) {}

  get allBills() {
    return this.aoService.bills();
  }

  get paidBills() {
    return this.allBills.filter(b => b.status === 'Paid');
  }

  get unpaidBills() {
    return this.allBills.filter(b => b.status !== 'Paid');
  }

  get filteredBills() {
    return this.filterBills(this.allBills);
  }

  get filteredPaidBills() {
    return this.filterBills(this.paidBills);
  }

  get filteredUnpaidBills() {
    return this.filterBills(this.unpaidBills);
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.aoService.getAllBills().subscribe({
      next: () => this.loading.set(false),
      error: (err) => {
        console.error('Error loading bills:', err);
        this.loading.set(false);
      }
    });
  }

  filterBills(bills: Bill[]) {
    let filtered = bills;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(b =>
        b.billNumber.toLowerCase().includes(term) ||
        b.consumerName.toLowerCase().includes(term) ||
        b.consumerCode.toLowerCase().includes(term)
      );
    }

    if (this.utilityFilter) {
      filtered = filtered.filter(b => b.utilityTypeName === this.utilityFilter);
    }

    return filtered;
  }

  applyFilters(): void {
    // Triggers filtering through getters
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.utilityFilter = '';
  }

  getUtilityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'Electricity': 'bolt',
      'Water': 'water_drop',
      'Gas': 'local_fire_department'
    };
    return icons[type] || 'power';
  }

  getBillStatusClass(status: string): string {
    return 'status-' + status.toLowerCase();
  }
}