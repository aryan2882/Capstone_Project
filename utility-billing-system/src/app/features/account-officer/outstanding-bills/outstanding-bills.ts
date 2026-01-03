// outstanding-bills.component.ts

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { AccountOfficerService } from '../../../core/services/account-officer';
import { Bill } from '../../../core/models/account-officer';

@Component({
  selector: 'app-outstanding-bills',
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
    MatTableModule
  ],
  template: `
    <div class="outstanding-container">
      <div class="page-header">
        <div>
          <h1><mat-icon>warning</mat-icon> Outstanding Bills</h1>
          <p>Manage unpaid and partially paid bills</p>
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
            <mat-icon>receipt</mat-icon>
            <div>
              <h3>{{filteredBills.length}}</h3>
              <p>Outstanding Bills</p>
            </div>
          </mat-card>
          <mat-card class="summary-card amount">
            <mat-icon>currency_rupee</mat-icon>
            <div>
              <h3>₹{{getTotalOutstanding() | number:'1.2-2'}}</h3>
              <p>Total Outstanding</p>
            </div>
          </mat-card>
          <mat-card class="summary-card overdue">
            <mat-icon>event_busy</mat-icon>
            <div>
              <h3>{{getOverdueBills().length}}</h3>
              <p>Overdue Bills</p>
            </div>
          </mat-card>
        </div>

        <!-- Filters -->
        <mat-card class="filters-card">
          <div class="filters">
            <mat-form-field appearance="outline">
              <mat-label>Search</mat-label>
              <input matInput placeholder="Bill number, consumer name..." [(ngModel)]="searchTerm" (ngModelChange)="applyFilters()">
              <mat-icon matPrefix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Utility Type</mat-label>
              <mat-select [(ngModel)]="utilityFilter" (selectionChange)="applyFilters()">
                <mat-option value="">All</mat-option>
                <mat-option value="Electricity">Electricity</mat-option>
                <mat-option value="Water">Water</mat-option>
                <mat-option value="Gas">Gas</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Status</mat-label>
              <mat-select [(ngModel)]="statusFilter" (selectionChange)="applyFilters()">
                <mat-option value="">All</mat-option>
                <mat-option value="Generated">Unpaid</mat-option>
                <mat-option value="Partial">Partial</mat-option>
                <mat-option value="Overdue">Overdue</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-raised-button (click)="clearFilters()">
              <mat-icon>clear</mat-icon>
              Clear
            </button>
          </div>
        </mat-card>

        <!-- Bills Table -->
        <mat-card>
          <div *ngIf="filteredBills.length === 0" class="empty-state">
            <mat-icon>check_circle</mat-icon>
            <h2>No Outstanding Bills!</h2>
            <p>All bills are paid or no bills match your filters.</p>
          </div>

          <div *ngIf="filteredBills.length > 0" class="table-container">
            <table class="bills-table">
              <thead>
                <tr>
                  <th>Bill Number</th>
                  <th>Consumer</th>
                  <th>Utility</th>
                  <th>Bill Date</th>
                  <th>Due Date</th>
                  <th>Total Amount</th>
                  <th>Paid</th>
                  <th>Outstanding</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let bill of filteredBills" [class.overdue]="isOverdue(bill.dueDate)">
                  <td class="bill-number">{{bill.billNumber}}</td>
                  <td>
                    <div class="consumer-info">
                      <strong>{{bill.consumerName}}</strong>
                      <span class="consumer-code">{{bill.consumerCode}}</span>
                    </div>
                  </td>
                  <td>
                    <span class="utility-badge" [class]="bill.utilityTypeName.toLowerCase()">
                      <mat-icon>{{getUtilityIcon(bill.utilityTypeName)}}</mat-icon>
                      {{bill.utilityTypeName}}
                    </span>
                  </td>
                  <td>{{bill.billDate | date:'dd MMM yyyy'}}</td>
                  <td>
                    <span [class.overdue-date]="isOverdue(bill.dueDate)">
                      {{bill.dueDate | date:'dd MMM yyyy'}}
                      <mat-icon *ngIf="isOverdue(bill.dueDate)" class="overdue-icon">event_busy</mat-icon>
                    </span>
                  </td>
                  <td class="amount">₹{{bill.totalAmount | number:'1.2-2'}}</td>
                  <td class="paid">₹{{bill.paidAmount | number:'1.2-2'}}</td>
                  <td class="outstanding">₹{{bill.outstandingAmount | number:'1.2-2'}}</td>
                  <td>
                    <mat-chip [class]="getBillStatusClass(bill.status)">
                      {{bill.status}}
                    </mat-chip>
                  </td>
                  <td class="actions">
                    <button mat-icon-button color="primary" 
                            [routerLink]="['/account-officer/make-payment']" 
                            [queryParams]="{billId: bill.billId}"
                            matTooltip="Record Payment">
                      <mat-icon>payment</mat-icon>
                    </button>
                    <button mat-icon-button 
                            [routerLink]="['/account-officer/consumers']" 
                            [queryParams]="{consumerId: bill.consumerId}"
                            matTooltip="View Consumer">
                      <mat-icon>person</mat-icon>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .outstanding-container { max-width: 1400px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    .page-header h1 { display: flex; align-items: center; gap: 12px; font-size: 28px; margin: 0 0 4px 0; }
    .page-header p { color: #666; margin: 0; }
    .page-header button { display: flex; align-items: center; gap: 8px; }
    
    .loading { display: flex; justify-content: center; padding: 60px; }
    
    .summary-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 24px; }
    .summary-card { display: flex; align-items: center; gap: 16px; padding: 24px; }
    .summary-card mat-icon { font-size: 48px; width: 48px; height: 48px; color: #f5576c; }
    .summary-card.amount mat-icon { color: #667eea; }
    .summary-card.overdue mat-icon { color: #ff9800; }
    .summary-card h3 { margin: 0; font-size: 28px; font-weight: 600; }
    .summary-card p { margin: 4px 0 0 0; color: #666; font-size: 14px; }
    
    .filters-card { padding: 24px; margin-bottom: 24px; }
    .filters { display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 16px; align-items: center; }
    .filters mat-form-field { width: 100%; }
    
    .empty-state { text-align: center; padding: 80px 20px; }
    .empty-state mat-icon { font-size: 100px; width: 100px; height: 100px; color: #4caf50; opacity: 0.5; }
    .empty-state h2 { margin: 24px 0 8px 0; }
    .empty-state p { color: #666; }
    
    .table-container { overflow-x: auto; }
    .bills-table { width: 100%; border-collapse: collapse; }
    .bills-table th { background-color: #f8f9fa; padding: 16px; text-align: left; font-weight: 600; border-bottom: 2px solid #e0e0e0; white-space: nowrap; }
    .bills-table td { padding: 16px; border-bottom: 1px solid #f0f0f0; }
    .bills-table tr:hover { background-color: #f8f9fa; }
    .bills-table tr.overdue { background-color: #fff3e0; }
    
    .bill-number { font-weight: 600; color: #667eea; }
    .consumer-info { display: flex; flex-direction: column; }
    .consumer-code { font-size: 12px; color: #999; }
    
    .utility-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px; border-radius: 12px; font-size: 13px; }
    .utility-badge mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .utility-badge.electricity { background-color: #e3f2fd; color: #1976d2; }
    .utility-badge.water { background-color: #e0f7fa; color: #00838f; }
    .utility-badge.gas { background-color: #fff3e0; color: #e65100; }
    
    .overdue-date { color: #f44336; font-weight: 600; display: flex; align-items: center; gap: 4px; }
    .overdue-icon { font-size: 16px; width: 16px; height: 16px; }
    
    .amount { font-weight: 500; }
    .paid { color: #4caf50; font-weight: 500; }
    .outstanding { color: #f5576c; font-weight: 600; font-size: 15px; }
    
    mat-chip.status-generated { background-color: #ffc107; color: #000; }
    mat-chip.status-partial { background-color: #ff9800; color: #fff; }
    mat-chip.status-paid { background-color: #4caf50; color: #fff; }
    
    .actions { white-space: nowrap; }
    
    @media (max-width: 768px) {
      .page-header { flex-direction: column; gap: 16px; }
      .filters { grid-template-columns: 1fr; }
      .summary-cards { grid-template-columns: 1fr; }
      .table-container { font-size: 13px; }
    }
  `]
})
export class OutstandingBillsComponent implements OnInit {
  loading = signal(true);
  searchTerm = '';
  utilityFilter = '';
  statusFilter = '';

  constructor(private aoService: AccountOfficerService) {}

  get outstandingBills() {
    return this.aoService.outstandingBills();
  }

  get filteredBills() {
    let bills = this.outstandingBills;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      bills = bills.filter(b => 
        b.billNumber.toLowerCase().includes(term) ||
        b.consumerName.toLowerCase().includes(term) ||
        b.consumerCode.toLowerCase().includes(term)
      );
    }

    if (this.utilityFilter) {
      bills = bills.filter(b => b.utilityTypeName === this.utilityFilter);
    }

    if (this.statusFilter) {
      if (this.statusFilter === 'Overdue') {
        bills = bills.filter(b => this.isOverdue(b.dueDate));
      } else {
        bills = bills.filter(b => b.status === this.statusFilter);
      }
    }

    return bills.sort((a, b) => b.outstandingAmount - a.outstandingAmount);
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.aoService.getOutstandingBills().subscribe({
      next: () => this.loading.set(false),
      error: (err) => {
        console.error('Error loading outstanding bills:', err);
        this.loading.set(false);
      }
    });
  }

  applyFilters(): void {
    // Triggers filtering through computed property
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.utilityFilter = '';
    this.statusFilter = '';
  }

  getTotalOutstanding(): number {
    return this.filteredBills.reduce((sum, bill) => sum + bill.outstandingAmount, 0);
  }

  getOverdueBills() {
    return this.filteredBills.filter(b => this.isOverdue(b.dueDate));
  }

  isOverdue(dueDate: string): boolean {
    return new Date(dueDate) < new Date();
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