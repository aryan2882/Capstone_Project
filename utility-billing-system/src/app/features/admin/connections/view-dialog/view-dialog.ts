import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Connection } from '../../../../core/models/connection';

@Component({
  selector: 'app-view-connection-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './view-dialog.html',
  styleUrls: ['./view-dialog.scss']
})
export class ViewConnectionDialogComponent {
  connection: Connection;

  constructor(
    public dialogRef: MatDialogRef<ViewConnectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { connection: Connection }
  ) {
    this.connection = data.connection;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}