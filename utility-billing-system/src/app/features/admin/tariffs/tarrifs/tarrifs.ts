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
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { CreateEditTariffDialogComponent } from '../create-edit-dialog/create-edit-dialog';
import { ViewTariffDialogComponent } from '../view-dialog/view-dialog';


import { TariffService } from '../tarrif';
import { UtilityTypeService } from '../../utility-types/utility-type';
import { Tariff } from '../../../../core/models/tariff';
import { UtilityType } from '../../../../core/models/utility-type';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
@Component({
  selector: 'app-tariffs',
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
    MatExpansionModule
  ],
  templateUrl: './tarrifs.html',
  styleUrls: ['./tarrifs.scss']
})
export class TariffsComponent implements OnInit {
  displayedColumns: string[] = [
    'id', 'planName', 'utilityType', 'charges', 'type', 'status', 'actions'
  ];
  dataSource: MatTableDataSource<Tariff>;
  filterValue = 'all';
  selectedUtilityType: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  loading = false;
  tariffs: Tariff[] = [];
  utilityTypes: UtilityType[] = [];

  constructor(
    private tariffService: TariffService,
    private utilityTypeService: UtilityTypeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Tariff>([]);
  }

  ngOnInit(): void {
    this.loadUtilityTypes();
    this.loadTariffs();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUtilityTypes(): void {
    this.utilityTypeService.getActiveUtilityTypes().subscribe({
      next: (data) => {
        this.utilityTypes = data;
      },
      error: (error) => {
        console.error('Failed to load utility types', error);
      }
    });
  }

  loadTariffs(): void {
    this.loading = true;
    
    const apiCall = this.selectedUtilityType 
      ? this.tariffService.getTariffsByUtilityType(this.selectedUtilityType)
      : this.tariffService.getAllTariffs();

    apiCall.subscribe({
      next: (data) => {
        this.tariffs = data;
        this.applyLocalFilter();
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load tariffs', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.applyLocalFilter();
  }

  applyLocalFilter(): void {
    let filtered = this.tariffs;

    if (this.filterValue === 'active') {
      filtered = filtered.filter(t => t.isActive);
    } else if (this.filterValue === 'inactive') {
      filtered = filtered.filter(t => !t.isActive);
    } else if (this.filterValue === 'slab') {
      filtered = filtered.filter(t => t.isSlabBased);
    } else if (this.filterValue === 'flat') {
      filtered = filtered.filter(t => !t.isSlabBased);
    }

    this.dataSource.data = filtered;
  }

  onUtilityTypeChange(): void {
    this.loadTariffs();
  }

  searchTariffs(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateEditTariffDialogComponent, {
      width: '800px',
      data: { mode: 'create', utilityTypes: this.utilityTypes }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createTariff(result);
      }
    });
  }

  openEditDialog(tariff: Tariff): void {
    this.tariffService.getTariffById(tariff.tariffId).subscribe({
      next: (fullTariff) => {
        const dialogRef = this.dialog.open(CreateEditTariffDialogComponent, {
          width: '800px',
          data: { mode: 'edit', tariff: fullTariff, utilityTypes: this.utilityTypes }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.updateTariff(tariff.tariffId, result);
          }
        });
      },
      error: (error) => {
        this.snackBar.open('Failed to load tariff details', 'Close', { duration: 3000 });
      }
    });
  }

  openViewDialog(tariff: Tariff): void {
    this.tariffService.getTariffById(tariff.tariffId).subscribe({
      next: (fullTariff) => {
        this.dialog.open(ViewTariffDialogComponent, {
          width: '700px',
          data: { tariff: fullTariff }
        });
      },
      error: (error) => {
        this.snackBar.open('Failed to load tariff details', 'Close', { duration: 3000 });
      }
    });
  }

  createTariff(data: any): void {
    this.loading = true;
    this.tariffService.createTariff(data).subscribe({
      next: () => {
        this.snackBar.open('Tariff created successfully', 'Close', { duration: 3000 });
        this.loadTariffs();
      },
      error: (error) => {
        this.snackBar.open('Failed to create tariff', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  updateTariff(id: number, data: any): void {
    this.loading = true;
    this.tariffService.updateTariff(id, data).subscribe({
      next: () => {
        this.snackBar.open('Tariff updated successfully', 'Close', { duration: 3000 });
        this.loadTariffs();
      },
      error: (error) => {
        this.snackBar.open('Failed to update tariff', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  deactivateTariff(tariff: Tariff): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Deactivate Tariff',
        message: `Are you sure you want to deactivate "${tariff.planName}"?`,
        confirmText: 'Deactivate',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.tariffService.deactivateTariff(tariff.tariffId).subscribe({
          next: () => {
            this.snackBar.open('Tariff deactivated successfully', 'Close', { duration: 3000 });
            this.loadTariffs();
          },
          error: (error) => {
            this.snackBar.open('Failed to deactivate tariff', 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    });
  }

  getStatusClass(isActive: boolean): string {
    return isActive ? 'status-active' : 'status-inactive';
  }

  getTypeClass(isSlabBased: boolean): string {
    return isSlabBased ? 'type-slab' : 'type-flat';
  }

  getUtilityTypeName(utilityTypeId: number): string {
    const utilityType = this.utilityTypes.find(ut => ut.utilityTypeId === utilityTypeId);
    return utilityType?.name || 'Unknown';
  }
}