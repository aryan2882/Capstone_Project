import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Tariff, CreateTariffRequest } from '../../../core/models/tariff';

@Injectable({
  providedIn: 'root'
})
export class TariffService {
  private apiUrl = `${environment.apiUrl}/tariffs`;

  constructor(private http: HttpClient) {}

  // Get all tariffs
  getAllTariffs(): Observable<Tariff[]> {
    return this.http.get<Tariff[]>(this.apiUrl);
  }

  // Get tariffs by utility type
  getTariffsByUtilityType(utilityTypeId: number): Observable<Tariff[]> {
    return this.http.get<Tariff[]>(`${this.apiUrl}/by-utility-type/${utilityTypeId}`);
  }

  // Get tariff by ID (with slabs)
  getTariffById(id: number): Observable<Tariff> {
    return this.http.get<Tariff>(`${this.apiUrl}/${id}`);
  }

  // Create tariff
  createTariff(data: CreateTariffRequest): Observable<Tariff> {
    return this.http.post<Tariff>(this.apiUrl, data);
  }

  // Update tariff
  updateTariff(id: number, data: CreateTariffRequest): Observable<Tariff> {
    return this.http.put<Tariff>(`${this.apiUrl}/${id}`, data);
  }

  // Deactivate tariff
  deactivateTariff(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}