import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from './storage';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router
  ) {}

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          console.log('Login response:', response); // Debug log
          
          // Save token
          this.storageService.saveToken(response.token);
          
          // Convert role string to number
          const roleNumber = this.getRoleNumber(response.role);
          
          console.log('Role string:', response.role, 'Role number:', roleNumber); // Debug log
          
          // Save user data with role converted to number
          const userData = {
            id: response.userId,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            role: roleNumber,
            roleString: response.role,
            consumerId: response.consumerId
          };
          
          console.log('Saving user data:', userData); // Debug log
          
          this.storageService.saveUser(userData);
        })
      );
  }

  logout(): void {
    this.storageService.clearStorage();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.storageService.isLoggedIn();
  }

  getCurrentUser(): any {
    const user = this.storageService.getUser();
    console.log('Current user from storage:', user); // Debug log
    return user;
  }

  getUserRole(): number | null {
    const role = this.storageService.getUserRole();
    console.log('User role:', role); // Debug log
    return role;
  }

  getUserRoleString(): string | null {
    const user = this.getCurrentUser();
    return user ? user.roleString : null;
  }

  // Convert role string to number
  private getRoleNumber(roleString: string): number {
    const roleMap: { [key: string]: number } = {
      'Admin': 1,
      'BillingOfficer': 2,
      'AccountOfficer': 3,
      'Consumer': 4
    };
    const roleNum = roleMap[roleString] || 0;
    console.log(`Converting role "${roleString}" to ${roleNum}`); // Debug log
    return roleNum;
  }

  // Helper methods for role checking
  isAdmin(): boolean {
    return this.getUserRole() === 1;
  }

  isBillingOfficer(): boolean {
    return this.getUserRole() === 2;
  }

  isAccountOfficer(): boolean {
    return this.getUserRole() === 3;
  }

  isConsumer(): boolean {
    return this.getUserRole() === 4;
  }
}