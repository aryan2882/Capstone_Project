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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { UtilityType } from '../../../../core/models/utility-type';
import { UtilityTypeService } from '../utility-type';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { CreateEditUtilityTypeDialogComponent } from '../create-edit-dialog/create-edit-dialog/create-edit-dialog';
@Component({
  selector: 'app-utility-types',
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
    MatSlideToggleModule
  ],
  templateUrl: './utility-types.html',
  styleUrls: ['./utility-types.scss']
})
export class UtilityTypesComponent implements OnInit {
  displayedColumns: string[] = [
    'id', 'name', 'unitOfMeasurement', 'description', 
    'baseRate', 'status', 'actions'
  ];
  dataSource: MatTableDataSource<UtilityType>;
  filterValue = 'all';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  loading = false;
  utilityTypes: UtilityType[] = [];

  constructor(
    private utilityTypeService: UtilityTypeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<UtilityType>([]);
  }

  ngOnInit(): void {
    this.loadUtilityTypes();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUtilityTypes(): void {
    this.loading = true;
    
    const apiCall = this.filterValue === 'active' 
      ? this.utilityTypeService.getActiveUtilityTypes()
      : this.utilityTypeService.getAllUtilityTypes();

    apiCall.subscribe({
      next: (data) => {
        this.utilityTypes = data;
        this.applyLocalFilter();
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load utility types', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.applyLocalFilter();
  }

  applyLocalFilter(): void {
    if (this.filterValue === 'all') {
      this.dataSource.data = this.utilityTypes;
    } else if (this.filterValue === 'active') {
      this.dataSource.data = this.utilityTypes.filter(ut => ut.isActive);
    } else if (this.filterValue === 'inactive') {
      this.dataSource.data = this.utilityTypes.filter(ut => !ut.isActive);
    }
  }

  searchUtilityTypes(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateEditUtilityTypeDialogComponent, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createUtilityType(result);
      }
    });
  }

  openEditDialog(utilityType: UtilityType): void {
    const dialogRef = this.dialog.open(CreateEditUtilityTypeDialogComponent, {
      width: '600px',
      data: { mode: 'edit', utilityType }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateUtilityType(utilityType.utilityTypeId, result);
      }
    });
  }

  createUtilityType(data: any): void {
    this.loading = true;
    this.utilityTypeService.createUtilityType(data).subscribe({
      next: () => {
        this.snackBar.open('Utility type created successfully', 'Close', { duration: 3000 });
        this.loadUtilityTypes();
      },
      error: (error) => {
        this.snackBar.open('Failed to create utility type', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  updateUtilityType(id: number, data: any): void {
    this.loading = true;
    this.utilityTypeService.updateUtilityType(id, data).subscribe({
      next: () => {
        this.snackBar.open('Utility type updated successfully', 'Close', { duration: 3000 });
        this.loadUtilityTypes();
      },
      error: (error) => {
        this.snackBar.open('Failed to update utility type', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  deactivateUtilityType(utilityType: UtilityType): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Deactivate Utility Type',
        message: `Are you sure you want to deactivate "${utilityType.name}"?`,
        confirmText: 'Deactivate',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.utilityTypeService.deactivateUtilityType(utilityType.utilityTypeId).subscribe({
          next: () => {
            this.snackBar.open('Utility type deactivated successfully', 'Close', { duration: 3000 });
            this.loadUtilityTypes();
          },
          error: (error) => {
            this.snackBar.open('Failed to deactivate utility type', 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    });
  }

  getStatusClass(isActive: boolean): string {
    return isActive ? 'status-active' : 'status-inactive';
  }
}