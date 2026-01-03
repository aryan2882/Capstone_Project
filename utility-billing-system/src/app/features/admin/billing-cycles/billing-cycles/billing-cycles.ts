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
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { BillingCycleService } from '../billing-cycle';
import { BillingCycle } from '../../../../core/models/billing-cycle';
import { CreateBillingCycleDialogComponent } from '../create-dialog/create-dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-billing-cycles',
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
    MatTooltipModule
  ],
  templateUrl: './billing-cycles.html',
  styleUrls: ['./billing-cycles.scss']
})
export class BillingCyclesComponent implements OnInit {
  displayedColumns: string[] = [
    'id', 'cycleName', 'period', 'deadlines', 'status', 'actions'
  ];
  dataSource: MatTableDataSource<BillingCycle>;
  filterValue = 'all';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  loading = false;
  billingCycles: BillingCycle[] = [];
  currentCycle: BillingCycle | null = null;

  constructor(
    private billingCycleService: BillingCycleService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<BillingCycle>([]);
  }

  ngOnInit(): void {
    this.loadBillingCycles();
    this.loadCurrentCycle();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadBillingCycles(): void {
    this.loading = true;
    this.billingCycleService.getAllBillingCycles().subscribe({
      next: (data) => {
        this.billingCycles = data;
        this.applyLocalFilter();
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load billing cycles', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  loadCurrentCycle(): void {
    this.billingCycleService.getCurrentBillingCycle().subscribe({
      next: (cycle) => {
        this.currentCycle = cycle;
      },
      error: () => {
        this.currentCycle = null;
      }
    });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.applyLocalFilter();
  }

  applyLocalFilter(): void {
    if (this.filterValue === 'all') {
      this.dataSource.data = this.billingCycles;
    } else if (this.filterValue === 'active') {
      this.dataSource.data = this.billingCycles.filter(bc => !bc.isClosed);
    } else if (this.filterValue === 'closed') {
      this.dataSource.data = this.billingCycles.filter(bc => bc.isClosed);
    }
  }

  searchBillingCycles(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateBillingCycleDialogComponent, {
      width: '700px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createBillingCycle(result);
      }
    });
  }

  createBillingCycle(data: any): void {
    this.loading = true;
    this.billingCycleService.createBillingCycle(data).subscribe({
      next: () => {
        this.snackBar.open('Billing cycle created successfully', 'Close', { duration: 3000 });
        this.loadBillingCycles();
        this.loadCurrentCycle();
      },
      error: (error) => {
        this.snackBar.open('Failed to create billing cycle', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  closeBillingCycle(cycle: BillingCycle): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Close Billing Cycle',
        message: `Are you sure you want to close "${cycle.cycleName}"? This action cannot be undone.`,
        confirmText: 'Close Cycle',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.billingCycleService.closeBillingCycle(cycle.billingCycleId).subscribe({
          next: () => {
            this.snackBar.open('Billing cycle closed successfully', 'Close', { duration: 3000 });
            this.loadBillingCycles();
            this.loadCurrentCycle();
          },
          error: (error) => {
            this.snackBar.open('Failed to close billing cycle', 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    });
  }

  getStatusClass(cycle: BillingCycle): string {
    if (cycle.isClosed) return 'status-closed';
    if (this.isCurrentCycle(cycle)) return 'status-current';
    return 'status-upcoming';
  }

  getStatusText(cycle: BillingCycle): string {
    if (cycle.isClosed) return 'Closed';
    if (this.isCurrentCycle(cycle)) return 'Current';
    return 'Upcoming';
  }

  isCurrentCycle(cycle: BillingCycle): boolean {
    return this.currentCycle?.billingCycleId === cycle.billingCycleId;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  formatDateTime(date: string): string {
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getDaysRemaining(date: string): number {
    const now = new Date();
    const targetDate = new Date(date);
    const diff = targetDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}