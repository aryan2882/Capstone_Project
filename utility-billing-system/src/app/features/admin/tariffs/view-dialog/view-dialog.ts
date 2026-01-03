import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { Tariff } from '../../../../core/models/tariff';

@Component({
  selector: 'app-view-tariff-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule
  ],
  templateUrl: './view-dialog.html',
  styleUrls: ['./view-dialog.scss']
})
export class ViewTariffDialogComponent {
  tariff: Tariff;
  displayedColumns = ['slabNumber', 'range', 'ratePerUnit'];

  constructor(
    public dialogRef: MatDialogRef<ViewTariffDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tariff: Tariff }
  ) {
    this.tariff = data.tariff;
  }

  getSlabRange(fromUnit: number, toUnit: number | null): string {
    if (toUnit === null) {
      return `${fromUnit}+ units`;
    }
    return `${fromUnit} - ${toUnit} units`;
  }

  onClose(): void {
    this.dialogRef.close();
  }
}