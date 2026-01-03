// reports.component.ts - Complete Implementation

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { ReportsService } from '../../../core/services/reports';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTableModule
  ],
  templateUrl: './reports.html',
  styleUrls: ['./reports.scss']
})
export class ReportsComponent implements OnInit {
  loading = signal(true);
  loadingReport = signal(false);
  
  // Date ranges
  revenueStartDate = new Date(new Date().getFullYear(), 0, 1);
  revenueEndDate = new Date();
  collectionStartDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  collectionEndDate = new Date();
  
  // Selected billing cycle
  selectedBillingCycle: number | null = null;

  constructor(private reportsService: ReportsService) {}

  get revenueReport() {
    return this.reportsService.revenueReport();
  }

  get outstandingReport() {
    return this.reportsService.outstandingReport();
  }

  get consumptionReport() {
    return this.reportsService.consumptionReport();
  }

  get collectionReport() {
    return this.reportsService.collectionReport();
  }

  get consumerSummary() {
    return this.reportsService.consumerSummary();
  }

  get billingCycles() {
    return this.reportsService.billingCycles();
  }

  ngOnInit(): void {
    this.loadBillingCycles();
  }

  loadBillingCycles(): void {
    this.reportsService.getBillingCycles().subscribe({
      next: () => this.loading.set(false),
      error: (err) => {
        console.error('Error loading billing cycles:', err);
        this.loading.set(false);
      }
    });
  }

  // Revenue Report
  loadRevenueReport(): void {
    this.loadingReport.set(true);
    const start = this.reportsService.formatDate(this.revenueStartDate);
    const end = this.reportsService.formatDate(this.revenueEndDate);
    
    this.reportsService.getRevenueReport(start, end).subscribe({
      next: () => this.loadingReport.set(false),
      error: (err) => {
        console.error('Error loading revenue report:', err);
        this.loadingReport.set(false);
      }
    });
  }

  // Outstanding Report
  loadOutstandingReport(): void {
    this.loadingReport.set(true);
    this.reportsService.getOutstandingReport().subscribe({
      next: () => this.loadingReport.set(false),
      error: (err) => {
        console.error('Error loading outstanding report:', err);
        this.loadingReport.set(false);
      }
    });
  }

  // Consumption Report
  loadConsumptionReport(): void {
    if (!this.selectedBillingCycle) return;
    
    this.loadingReport.set(true);
    this.reportsService.getConsumptionReport(this.selectedBillingCycle).subscribe({
      next: () => this.loadingReport.set(false),
      error: (err) => {
        console.error('Error loading consumption report:', err);
        this.loadingReport.set(false);
      }
    });
  }

  // Collection Report
  loadCollectionReport(): void {
    this.loadingReport.set(true);
    const start = this.reportsService.formatDate(this.collectionStartDate);
    const end = this.reportsService.formatDate(this.collectionEndDate);
    
    this.reportsService.getCollectionReport(start, end).subscribe({
      next: () => this.loadingReport.set(false),
      error: (err) => {
        console.error('Error loading collection report:', err);
        this.loadingReport.set(false);
      }
    });
  }

  // Consumer Summary Report
  loadConsumerSummary(): void {
    this.loadingReport.set(true);
    this.reportsService.getConsumerSummaryReport().subscribe({
      next: () => this.loadingReport.set(false),
      error: (err) => {
        console.error('Error loading consumer summary:', err);
        this.loadingReport.set(false);
      }
    });
  }

  // Helpers
  getTotalOutstanding(): number {
    return this.outstandingReport.reduce((sum, c) => sum + c.totalOutstanding, 0);
  }

  getTotalCollection(): number {
    return this.collectionReport.reduce((sum, c) => sum + c.totalAmount, 0);
  }

  getCollectionCount(): number {
    return this.collectionReport.reduce((sum, c) => sum + c.transactionCount, 0);
  }

  isOverdue(daysOverdue: number): boolean {
    return daysOverdue > 0;
  }

  getPaymentModeClass(mode: string): string {
    return mode.toLowerCase();
  }
}