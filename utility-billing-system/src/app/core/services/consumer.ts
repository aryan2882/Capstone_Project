// consumer.service.ts - Updated with Signals

import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ConsumerProfile,
  UpdateConsumerProfile,
  Bill,
  Connection,
  ConsumptionReport
} from '../models/consumer_new';

@Injectable({
  providedIn: 'root'
})
export class ConsumerService {
  private apiUrl = environment.apiUrl;
  
  // Signals for reactive state management
  private profileSignal = signal<ConsumerProfile | null>(null);
  private billsSignal = signal<Bill[]>([]);
  private connectionsSignal = signal<Connection[]>([]);
  
  // Public readonly signals
  public profile = this.profileSignal.asReadonly();
  public bills = this.billsSignal.asReadonly();
  public connections = this.connectionsSignal.asReadonly();
  
  // Computed signals for derived state
  public unpaidBills = computed(() => 
    this.billsSignal().filter(b => b.status === 'Generated' || b.status === 'Partial')
  );
  
  public paidBills = computed(() => 
    this.billsSignal().filter(b => b.status === 'Paid')
  );
  
  public activeConnections = computed(() => 
    this.connectionsSignal().filter(c => c.status === 'Active')
  );
  
  public totalOutstanding = computed(() => 
    this.billsSignal().reduce((sum, bill) => sum + bill.outstandingAmount, 0)
  );

  constructor(private http: HttpClient) {}

  // Profile Methods
  getMyProfile(): Observable<ConsumerProfile> {
    return this.http.get<ConsumerProfile>(`${this.apiUrl}/consumers/my-profile`).pipe(
      tap(profile => this.profileSignal.set(profile))
    );
  }

  updateMyProfile(data: UpdateConsumerProfile): Observable<ConsumerProfile> {
    return this.http.put<ConsumerProfile>(`${this.apiUrl}/consumers/my-profile`, data).pipe(
      tap(profile => this.profileSignal.set(profile))
    );
  }

  // Bills Methods
  getMyBills(consumerId: number): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.apiUrl}/bills/consumer/${consumerId}`).pipe(
      tap(bills => this.billsSignal.set(bills))
    );
  }

  // Connections Methods
  getMyConnections(consumerId: number): Observable<Connection[]> {
    return this.http.get<Connection[]>(`${this.apiUrl}/connections/consumer/${consumerId}`).pipe(
      tap(connections => this.connectionsSignal.set(connections))
    );
  }

  // Consumption Methods
  getConsumptionReport(connectionId: number): Observable<ConsumptionReport> {
    return this.http.get<ConsumptionReport>(`${this.apiUrl}/consumers/my-consumption/${connectionId}`);
  }

  // Load all consumer data at once
  loadAllConsumerData(): Observable<ConsumerProfile> {
    return new Observable(observer => {
      this.getMyProfile().subscribe({
        next: (profile) => {
          // Load bills and connections in parallel
          this.getMyBills(profile.consumerId).subscribe();
          this.getMyConnections(profile.consumerId).subscribe();
          observer.next(profile);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  // Clear all data on logout
  clearAllData(): void {
    this.profileSignal.set(null);
    this.billsSignal.set([]);
    this.connectionsSignal.set([]);
  }
}