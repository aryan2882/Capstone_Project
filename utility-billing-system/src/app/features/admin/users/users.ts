import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

import { AdminService } from '../admin';
import { User, RoleNames, UserRole } from '../../../core/models/user';

import { AssignRoleDialogComponent } from './assign-role-dialog/assign-role-dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.html',
  styleUrls: ['./users.scss'],
  imports: [
    CommonModule,
    FormsModule,

    // Angular Material
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,

    // Dialog components
    AssignRoleDialogComponent,
    ConfirmDialogComponent,
    MatCard,MatCardContent,MatDialogActions,MatDialogContent,MatSpinner,MatMenu,MatMenuTrigger
  ]
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = [
    'id', 'name', 'email', 'phone', 'city', 'state', 
    'idProof', 'role', 'actions'
  ];
  dataSource: MatTableDataSource<any>;
  roleNames = RoleNames;
  filterValue = 'pending';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  loading = false;
  users: any[] = [];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit(): void {
    this.loadUsers('pending');
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers(filter: string): void {
    this.loading = true;
    this.filterValue = filter;

    let apiCall;
    
    switch (filter) {
      case 'pending':
        apiCall = this.adminService.getPendingUsers();
        break;
      case 'consumers':
        apiCall = this.adminService.getConsumers();
        break;
      case 'staff':
        apiCall = this.adminService.getStaff();
        break;
      default:
        apiCall = this.adminService.getPendingUsers();
    }

    apiCall.subscribe({
      next: (data) => {
        console.log('Loaded data:', data); // Debug log
        console.log('Filter value:', filter);
        if (filter === 'staff') {
        const filteredData = data.filter((staff: any) => staff.isActive === true);
        console.log('Filtered active staff:', filteredData);
        this.users = filteredData;
        this.dataSource.data = filteredData;
      } else {
        this.users = data;
        this.dataSource.data = data;
      }
      
      this.loading = false;
    },
      error: (error) => {
        console.error('Error loading users:', error);
        this.snackBar.open('Failed to load users', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  applyFilter(filterValue: string): void {
    this.loadUsers(filterValue);
  }

  searchUsers(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAssignRoleDialog(user: any): void {
    const dialogRef = this.dialog.open(AssignRoleDialogComponent, {
      width: '400px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.assignRole(user.userId, result.role);
      }
    });
  }

  assignRole(userId: number, role: number): void {
    this.loading = true;
    this.adminService.assignRole(userId, { role }).subscribe({
      next: () => {
        this.snackBar.open('Role assigned successfully', 'Close', { duration: 3000 });
        this.loadUsers(this.filterValue);
      },
      error: (error) => {
        this.snackBar.open('Failed to assign role', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  deleteUser(user: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete User',
        message: `Are you sure you want to delete ${user.firstName} ${user.lastName}?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        // Use the new deleteUserByType method that handles different endpoints
        this.adminService.deleteUserByType(user).subscribe({
          next: () => {
            this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
            this.loadUsers(this.filterValue);
          },
          error: (error) => {
            console.error('Delete error:', error);
            const errorMsg = error.error?.message || 'Failed to delete user';
            this.snackBar.open(errorMsg, 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    });
  }

  getRoleBadgeClass(role: number): string {
    switch (role) {
      case UserRole.Admin: return 'badge-admin';
      case UserRole.BillingOfficer: return 'badge-billing';
      case UserRole.AccountOfficer: return 'badge-account';
      case UserRole.Consumer: return 'badge-consumer';
      default: return 'badge-pending';
    }
  }

  getFullName(user: any): string {
    return `${user.firstName} ${user.lastName}`;
  }

  getUserId(user: any): number {
    // Handle both userId and consumerId
    return user.userId || user.consumerId || 0;
  }
}