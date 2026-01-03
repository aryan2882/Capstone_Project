import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UtilityType, CreateUtilityTypeRequest, UpdateUtilityTypeRequest } from '../../../core/models/utility-type';

@Injectable({
  providedIn: 'root'
})
export class UtilityTypeService {
  private apiUrl = `${environment.apiUrl}/utilitytypes`;

  constructor(private http: HttpClient) {}

  // Get all utility types
  getAllUtilityTypes(): Observable<UtilityType[]> {
    return this.http.get<UtilityType[]>(this.apiUrl);
  }

  // Get active utility types only
  getActiveUtilityTypes(): Observable<UtilityType[]> {
    return this.http.get<UtilityType[]>(`${this.apiUrl}/active`);
  }

  // Get utility type by ID
  getUtilityTypeById(id: number): Observable<UtilityType> {
    return this.http.get<UtilityType>(`${this.apiUrl}/${id}`);
  }

  // Create utility type
  createUtilityType(data: CreateUtilityTypeRequest): Observable<UtilityType> {
    return this.http.post<UtilityType>(this.apiUrl, data);
  }

  // Update utility type
  updateUtilityType(id: number, data: UpdateUtilityTypeRequest): Observable<UtilityType> {
    return this.http.put<UtilityType>(`${this.apiUrl}/${id}`, data);
  }

  // Deactivate utility type
  deactivateUtilityType(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}