import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,map } from 'rxjs';
import { User } from '../../core/models/user';
import { AssignRoleRequest } from '../../core/models/auth';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/users`;

  // Role string to number mapping
  private roleStringToNumber(roleString: string): number {
    const roleMap: { [key: string]: number } = {
      'Admin': 1,
      'BillingOfficer': 2,
      'AccountOfficer': 3,
      'Consumer': 4
    };
    return roleMap[roleString] || 0;
  }

  constructor(private http: HttpClient) {}

  // Get pending users (no role assigned)
  getPendingUsers(): Observable<User[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pending`).pipe(
      map(users => users.map(user => ({
        ...user,
        userId: user.userId,
        role: 0 // Pending users have no role
      })))
    );
  }

  // Get staff (Billing Officers + Account Officers)
  getStaff(): Observable<User[]> {
    return this.http.get<any[]>(`${this.apiUrl}/staff`).pipe(
      map(users => {
        return users.map(user => {
          // Convert string role to number
          const roleNumber = typeof user.role === 'string' 
            ? this.roleStringToNumber(user.role)
            : (user.role || 0);
          
          return {
            ...user,
            userId: user.userId,
            role: roleNumber,
            roleString: user.role // Keep original for reference
          };
        });
      })
    );
  }

  // Get consumers - Need to map consumerId to userId
  getConsumers(): Observable<User[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/consumers`).pipe(
      map(consumers => consumers.map(consumer => {
        // Convert string role to number if present
        const roleNumber = consumer.role 
          ? (typeof consumer.role === 'string' 
              ? this.roleStringToNumber(consumer.role)
              : consumer.role)
          : 4; // Default to Consumer role
        
        return {
          ...consumer,
          userId: consumer.consumerId || consumer.userId, // Map consumerId to userId
          role: roleNumber,
          roleString: consumer.role || 'Consumer'
        };
      }))
    );
  }

  // Assign role
  assignRole(userId: number, roleData: AssignRoleRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}/assign-role`, roleData);
  }

  // Delete user
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }

  // Delete consumer (uses different endpoint)
  deleteConsumer(consumerId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/consumers/${consumerId}`);
  }

  // Delete based on user type
  deleteUserByType(user: any): Observable<any> {
    // If user has role 4 (Consumer) or has consumerId, use consumer endpoint
    if (user.role === 4 || user.consumerId) {
      return this.deleteConsumer(user.consumerId || user.userId);
    }
    // For pending users and staff, use regular user endpoint
    return this.deleteUser(user.userId);
  }
}