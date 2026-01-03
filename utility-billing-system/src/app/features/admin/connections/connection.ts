import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  Connection, 
  CreateConnectionRequest, 
  UpdateConnectionRequest,
  DisconnectConnectionRequest 
} from '../../../core/models/connection';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private apiUrl = `${environment.apiUrl}/connections`;

  constructor(private http: HttpClient) {}

  // Get all connections
  getAllConnections(): Observable<Connection[]> {
    return this.http.get<Connection[]>(this.apiUrl);
  }

  // Get connections by consumer
  getConnectionsByConsumer(consumerId: number): Observable<Connection[]> {
    return this.http.get<Connection[]>(`${this.apiUrl}/consumer/${consumerId}`);
  }

  // Get connection by ID
  getConnectionById(id: number): Observable<Connection> {
    return this.http.get<Connection>(`${this.apiUrl}/${id}`);
  }

  // Create connection
  createConnection(data: CreateConnectionRequest): Observable<Connection> {
    return this.http.post<Connection>(this.apiUrl, data);
  }

  // Update connection
  updateConnection(id: number, data: UpdateConnectionRequest): Observable<Connection> {
    return this.http.put<Connection>(`${this.apiUrl}/${id}`, data);
  }

  // Disconnect connection
  disconnectConnection(id: number, data: DisconnectConnectionRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/disconnect`, data);
  }
}