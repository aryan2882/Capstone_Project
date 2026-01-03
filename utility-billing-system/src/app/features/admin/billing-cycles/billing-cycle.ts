import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BillingCycle,CreateBillingCycleRequest } from '../../../core/models/billing-cycle';

@Injectable({
  providedIn: 'root'
})
export class BillingCycleService {
  private apiUrl = `${environment.apiUrl}/billingcycles`;

  constructor(private http: HttpClient) {}

  // Get all billing cycles
  getAllBillingCycles(): Observable<BillingCycle[]> {
    return this.http.get<BillingCycle[]>(this.apiUrl);
  }

  // Get current billing cycle
  getCurrentBillingCycle(): Observable<BillingCycle> {
    return this.http.get<BillingCycle>(`${this.apiUrl}/current`);
  }

  // Get billing cycle by ID
  getBillingCycleById(id: number): Observable<BillingCycle> {
    return this.http.get<BillingCycle>(`${this.apiUrl}/${id}`);
  }

  // Create billing cycle
  createBillingCycle(data: CreateBillingCycleRequest): Observable<BillingCycle> {
    return this.http.post<BillingCycle>(this.apiUrl, data);
  }

  // Close billing cycle
  closeBillingCycle(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/close`, {});
  }
}