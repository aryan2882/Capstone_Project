import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MeterReading } from "../models/meter-reading";
import { Observable } from "rxjs";
@Injectable({ providedIn: 'root' })
export class MeterReadingService {

  private baseUrl = 'http://localhost:5128/api/';

  constructor(private http: HttpClient) {}

  getConnections() {
    return this.http.get<any[]>(`${this.baseUrl}connections`);
  }

  getBillingCycles() {
    return this.http.get<any[]>(`${this.baseUrl}billingcycles`);
  }

  createReading(dto: any) {
    return this.http.post<any>(`${this.baseUrl}meterreadings`, dto);
  }

  getByBillingCycle(billingCycleId: number): Observable<MeterReading[]> {
    return this.http.get<MeterReading[]>(`${this.baseUrl}meterreadings/billing-cycle/${billingCycleId}`);
  }
}
