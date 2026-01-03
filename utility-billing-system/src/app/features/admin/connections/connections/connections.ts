import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { CreateConnectionDialogComponent } from '../create-dialog/create-dialog';
import { EditConnectionDialogComponent } from '../edit-dialog/edit-dialog';
import { DisconnectDialogComponent } from '../disconnect-dialog/disconnect-dialog';
import { ViewConnectionDialogComponent } from '../view-dialog/view-dialog';

import { ConnectionService } from '../connection';
import { AdminService } from '../../admin';
import { Connection } from '../../../../core/models/connection';

@Component({
  selector: 'app-connections',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatChipsModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule
  ],
  templateUrl: './connections.html',
  styleUrls: ['./connections.scss']
})
export class ConnectionsComponent implements OnInit {
  displayedColumns: string[] = [
    'id', 'consumer', 'utilityType', 'meterNumber', 
    'connectionLoad', 'tariff', 'status', 'actions'
  ];
  dataSource: MatTableDataSource<Connection>;
  filterValue = 'all';
  selectedConsumer: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  loading = false;
  connections: Connection[] = [];
  consumers: any[] = [];

  constructor(
    private connectionService: ConnectionService,
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Connection>([]);
  }

  ngOnInit(): void {
    this.loadConsumers();
    this.loadConnections();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadConsumers(): void {
    this.adminService.getConsumers().subscribe({
      next: (data) => {
        this.consumers = data;
      },
      error: (error) => {
        console.error('Failed to load consumers', error);
      }
    });
  }

  loadConnections(): void {
    this.loading = true;
    
    const apiCall = this.selectedConsumer 
      ? this.connectionService.getConnectionsByConsumer(this.selectedConsumer)
      : this.connectionService.getAllConnections();

    apiCall.subscribe({
      next: (data) => {
        this.connections = data;
        this.applyLocalFilter();
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load connections', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.applyLocalFilter();
  }

  applyLocalFilter(): void {
    let filtered = this.connections;

    if (this.filterValue === 'active') {
filtered = filtered.filter(c => c.status === 'Active');
    } else if (this.filterValue === 'disconnected') {
filtered = filtered.filter(c => c.status === 'Disconnected');
    }

    this.dataSource.data = filtered;
  }

  onConsumerChange(): void {
    this.loadConnections();
  }

  searchConnections(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateConnectionDialogComponent, {
      width: '700px',
      data: { consumers: this.consumers }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createConnection(result);
      }
    });
  }

  openEditDialog(connection: Connection): void {
    const dialogRef = this.dialog.open(EditConnectionDialogComponent, {
      width: '600px',
      data: { connection }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateConnection(connection.connectionId, result);
      }
    });
  }

  openViewDialog(connection: Connection): void {
    this.dialog.open(ViewConnectionDialogComponent, {
      width: '700px',
      data: { connection }
    });
  }

  openDisconnectDialog(connection: Connection): void {
    const dialogRef = this.dialog.open(DisconnectDialogComponent, {
      width: '500px',
      data: { connection }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.disconnectConnection(connection.connectionId, result);
      }
    });
  }

  createConnection(data: any): void {
    this.loading = true;
    this.connectionService.createConnection(data).subscribe({
      next: () => {
        this.snackBar.open('Connection created successfully', 'Close', { duration: 3000 });
        this.loadConnections();
      },
      error: (error) => {
        this.snackBar.open('Failed to create connection', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  updateConnection(id: number, data: any): void {
    this.loading = true;
    this.connectionService.updateConnection(id, data).subscribe({
      next: () => {
        this.snackBar.open('Connection updated successfully', 'Close', { duration: 3000 });
        this.loadConnections();
      },
      error: (error) => {
        this.snackBar.open('Failed to update connection', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  disconnectConnection(id: number, data: any): void {
    this.loading = true;
    this.connectionService.disconnectConnection(id, data).subscribe({
      next: () => {
        this.snackBar.open('Connection disconnected successfully', 'Close', { duration: 3000 });
        this.loadConnections();
      },
      error: (error) => {
        this.snackBar.open('Failed to disconnect connection', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  getStatusClass(connection:Connection): string {
  return connection.status === 'Active' ? 'status-active' : 'status-disconnected';
  }

  getStatusText(connection: Connection): string {
      return connection.status || 'Unknown';

  }

  getConsumerName(consumerId: number): string {
    const consumer = this.consumers.find(c => (c.userId || c.consumerId) === consumerId);
    return consumer ? `${consumer.firstName} ${consumer.lastName}` : 'Unknown';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}