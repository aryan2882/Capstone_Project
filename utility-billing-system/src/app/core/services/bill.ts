// src/app/services/bill.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Bill } from '../models/bill';
import { GenerateBillRequest } from '../models/bill';


@Injectable({
  providedIn: 'root'
})
export class BillService {
  private apiUrl = `${environment.apiUrl}/bills`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  generateBill(request: GenerateBillRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate`, request, {
      headers: this.getHeaders()
    });
  }

  getAllBills(): Observable<Bill[]> {
    return this.http.get<Bill[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  getBillById(billId: number): Observable<Bill> {
    return this.http.get<Bill>(`${this.apiUrl}/${billId}`, {
      headers: this.getHeaders()
    });
  }
}

  
