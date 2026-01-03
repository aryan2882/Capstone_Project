// account-officer.service.ts - Create in core/services/

import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Consumer,
  Bill,
  Payment,
  RecordOfflinePaymentRequest,
  OfflinePaymentResponse
} from '../models/account-officer';

@Injectable({
  providedIn: 'root'
})
export class AccountOfficerService {
  private apiUrl = environment.apiUrl;
  
  // Signals for reactive state management
  private consumersSignal = signal<Consumer[]>([]);
  private billsSignal = signal<Bill[]>([]);
  private outstandingBillsSignal = signal<Bill[]>([]);
  private paymentsSignal = signal<Payment[]>([]);
  
  // Public readonly signals
  public consumers = this.consumersSignal.asReadonly();
  public bills = this.billsSignal.asReadonly();
  public outstandingBills = this.outstandingBillsSignal.asReadonly();
  public payments = this.paymentsSignal.asReadonly();
  
  // Computed signals
  public totalOutstanding = computed(() => 
    this.outstandingBillsSignal().reduce((sum, bill) => sum + bill.outstandingAmount, 0)
  );
  
  public totalPaymentsReceived = computed(() => 
    this.paymentsSignal().reduce((sum, payment) => sum + payment.amount, 0)
  );

  constructor(private http: HttpClient) {}

  // Consumer Management
  getAllConsumers(): Observable<Consumer[]> {
    return this.http.get<Consumer[]>(`${this.apiUrl}/consumers`).pipe(
      tap(consumers => this.consumersSignal.set(consumers))
    );
  }

  getConsumerById(consumerId: number): Observable<Consumer> {
    return this.http.get<Consumer>(`${this.apiUrl}/consumers/${consumerId}`);
  }

  // Bills Management
  getAllBills(): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.apiUrl}/bills`).pipe(
      tap(bills => this.billsSignal.set(bills))
    );
  }

  getOutstandingBills(): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.apiUrl}/bills/outstanding`).pipe(
      tap(bills => this.outstandingBillsSignal.set(bills))
    );
  }

  getBillsByConsumer(consumerId: number): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.apiUrl}/bills/consumer/${consumerId}`);
  }

  // Payments Management
  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/payments`).pipe(
      tap(payments => this.paymentsSignal.set(payments))
    );
  }

  getPaymentsByConsumer(consumerId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/payments/consumer/${consumerId}`);
  }

  // Record Offline Payment
  recordOfflinePayment(request: RecordOfflinePaymentRequest): Observable<OfflinePaymentResponse> {
    return this.http.post<OfflinePaymentResponse>(
      `${this.apiUrl}/payments/record-offline`,
      request
    ).pipe(
      tap(response => {
        if (response.success && response.payment) {
          // Add new payment to local state
          const currentPayments = this.paymentsSignal();
          this.paymentsSignal.set([response.payment, ...currentPayments]);
        }
      })
    );
  }

  // Load all data at once for dashboard
  loadAllData(): Observable<any> {
    return new Observable(observer => {
      Promise.all([
        this.getAllConsumers().toPromise(),
        this.getOutstandingBills().toPromise(),
        this.getAllPayments().toPromise()
      ]).then(() => {
        observer.next(true);
        observer.complete();
      }).catch(err => {
        observer.error(err);
      });
    });
  }

  // Clear all data on logout
  clearAllData(): void {
    this.consumersSignal.set([]);
    this.billsSignal.set([]);
    this.outstandingBillsSignal.set([]);
    this.paymentsSignal.set([]);
  }

  // Helper methods
  getConsumerFullName(consumer: Consumer): string {
    return `${consumer.firstName} ${consumer.lastName}`;
  }

  getOfflinePaymentModeName(mode: number): string {
    const modeMap: { [key: number]: string } = {
      1: 'Cash',
      3: 'Cheque',
      4: 'Bank Transfer',
      5: 'Demand Draft'
    };
    return modeMap[mode] || 'Unknown';
  }
}