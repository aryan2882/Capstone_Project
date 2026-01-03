// core/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Consumer } from '../models/consumer';
import { BillingCycle } from '../models/billing-cycle';
import { Connection } from '../models/connection';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getConsumers(): Observable<Consumer[]> {
    return this.http.get<Consumer[]>(`${this.apiUrl}/consumers`);
  }

  getBillingCycles(): Observable<BillingCycle[]> {
    return this.http.get<BillingCycle[]>(`${this.apiUrl}/billingcycles`);
  }

  getConnections(): Observable<Connection[]> {
    return this.http.get<Connection[]>(`${this.apiUrl}/connections`);
  }
}
