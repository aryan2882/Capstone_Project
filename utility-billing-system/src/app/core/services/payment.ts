// payment.service.ts - Create in core/services/

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MakePaymentRequest, PaymentResponse, Payment } from '../models/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = environment.apiUrl;
  
  // Signal for payment history
  private paymentsSignal = signal<Payment[]>([]);
  public payments = this.paymentsSignal.asReadonly();

  constructor(private http: HttpClient) {}

  // Make online payment
  makeOnlinePayment(request: MakePaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/payments/make-online-payment`, request);
  }

  // Get payment history
  getMyPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/payments/my-payments`).pipe(
      tap(payments => this.paymentsSignal.set(payments))
    );
  }

  // Get payment by ID
  getPaymentById(paymentId: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/payments/${paymentId}`);
  }

  // Clear payments on logout
  clearPayments(): void {
    this.paymentsSignal.set([]);
  }

  // Generate mock transaction ID (for UI simulation)
  generateMockTransactionId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `TXN${timestamp}${random}`;
  }
}