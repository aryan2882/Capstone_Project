import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Connection } from '../../../../core/models/connection';
import { TariffService } from '../../tariffs/tarrif';

@Component({
  selector: 'app-edit-connection-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './edit-dialog.html',
  styleUrls: ['./edit-dialog.scss']
})
export class EditConnectionDialogComponent implements OnInit {
  connectionForm: FormGroup;
  connection: Connection;
  tariffs: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditConnectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { connection: Connection },
    private tariffService: TariffService
  ) {
    this.connection = data.connection;

    this.connectionForm = this.fb.group({
      tariffId: [this.connection.tariffId, [Validators.required]],
      meterNumber: [this.connection.meterNumber, [Validators.required, Validators.minLength(5)]],
      connectionLoad: [this.connection.connectionLoad, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadTariffs();
  }

  loadTariffs(): void {
    this.tariffService.getTariffsByUtilityType(this.connection.utilityTypeId).subscribe({
      next: (data) => {
        this.tariffs = data.filter(t => t.isActive);
      },
      error: (error) => {
        console.error('Failed to load tariffs', error);
      }
    });
  }

  onSubmit(): void {
    if (this.connectionForm.valid) {
      const data = {
        tariffId: this.connectionForm.value.tariffId,
        meterNumber: this.connectionForm.value.meterNumber,
        connectionLoad: parseFloat(this.connectionForm.value.connectionLoad)
      };
      
      this.dialogRef.close(data);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}