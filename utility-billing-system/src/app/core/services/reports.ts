// reports.service.ts - Create in core/services/

import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  RevenueReport,
  OutstandingConsumer,
  ConsumptionReportData,
  CollectionData,
  ConsumerSummary,
  BillingCycle
} from '../models/reports';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = environment.apiUrl;
  
  // Signals for caching report data
  private revenueReportSignal = signal<RevenueReport | null>(null);
  private outstandingReportSignal = signal<OutstandingConsumer[]>([]);
  private consumptionReportSignal = signal<ConsumptionReportData[]>([]);
  private collectionReportSignal = signal<CollectionData[]>([]);
  private consumerSummarySignal = signal<ConsumerSummary[]>([]);
  private billingCyclesSignal = signal<BillingCycle[]>([]);
  
  // Public readonly signals
  public revenueReport = this.revenueReportSignal.asReadonly();
  public outstandingReport = this.outstandingReportSignal.asReadonly();
  public consumptionReport = this.consumptionReportSignal.asReadonly();
  public collectionReport = this.collectionReportSignal.asReadonly();
  public consumerSummary = this.consumerSummarySignal.asReadonly();
  public billingCycles = this.billingCyclesSignal.asReadonly();

  constructor(private http: HttpClient) {}

  // Get Revenue Report
  getRevenueReport(startDate: string, endDate: string): Observable<RevenueReport> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    return this.http.get<RevenueReport>(`${this.apiUrl}/reports/revenue`, { params }).pipe(
      tap(report => this.revenueReportSignal.set(report))
    );
  }

  // Get Outstanding Report
  getOutstandingReport(): Observable<OutstandingConsumer[]> {
    return this.http.get<OutstandingConsumer[]>(`${this.apiUrl}/reports/outstanding`).pipe(
      tap(report => this.outstandingReportSignal.set(report))
    );
  }

  // Get Consumption Report
  getConsumptionReport(billingCycleId: number): Observable<ConsumptionReportData[]> {
    return this.http.get<ConsumptionReportData[]>(
      `${this.apiUrl}/reports/consumption/${billingCycleId}`
    ).pipe(
      tap(report => this.consumptionReportSignal.set(report))
    );
  }

  // Get Collection Report
  getCollectionReport(startDate: string, endDate: string): Observable<CollectionData[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    return this.http.get<CollectionData[]>(`${this.apiUrl}/reports/collection`, { params }).pipe(
      tap(report => this.collectionReportSignal.set(report))
    );
  }

  // Get Consumer Summary Report
  getConsumerSummaryReport(): Observable<ConsumerSummary[]> {
    return this.http.get<ConsumerSummary[]>(`${this.apiUrl}/reports/consumer-summary`).pipe(
      tap(report => this.consumerSummarySignal.set(report))
    );
  }

  // Get Billing Cycles
  getBillingCycles(): Observable<BillingCycle[]> {
    return this.http.get<BillingCycle[]>(`${this.apiUrl}/billingcycles`).pipe(
      tap(cycles => this.billingCyclesSignal.set(cycles))
    );
  }

  // Clear all cached data
  clearAllReports(): void {
    this.revenueReportSignal.set(null);
    this.outstandingReportSignal.set([]);
    this.consumptionReportSignal.set([]);
    this.collectionReportSignal.set([]);
    this.consumerSummarySignal.set([]);
    this.billingCyclesSignal.set([]);
  }

  // Helper: Format date for API
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Helper: Get date range presets
  getDateRangePresets() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const lastDayOfYear = new Date(today.getFullYear(), 11, 31);

    return {
      thisMonth: {
        start: this.formatDate(firstDayOfMonth),
        end: this.formatDate(lastDayOfMonth)
      },
      lastMonth: {
        start: this.formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)),
        end: this.formatDate(new Date(today.getFullYear(), today.getMonth(), 0))
      },
      thisYear: {
        start: this.formatDate(firstDayOfYear),
        end: this.formatDate(lastDayOfYear)
      },
      last30Days: {
        start: this.formatDate(new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)),
        end: this.formatDate(today)
      }
    };
  }
}