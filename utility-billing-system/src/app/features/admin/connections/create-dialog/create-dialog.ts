import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { UtilityTypeService } from '../../utility-types/utility-type';
import { Tariff } from '../../../../core/models/tariff';
import { TariffService } from '../../tariffs/tarrif';

@Component({
  selector: 'app-create-connection-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './create-dialog.html',
  styleUrls: ['./create-dialog.scss']
})
export class CreateConnectionDialogComponent implements OnInit {
  connectionForm: FormGroup;
  consumers: any[];
  utilityTypes: any[] = [];
  tariffs: any[] = [];
  filteredTariffs: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateConnectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { consumers: any[] },
    private utilityTypeService: UtilityTypeService,
    private tariffService: TariffService
  ) {
    this.consumers = data.consumers;

    this.connectionForm = this.fb.group({
      consumerId: ['', [Validators.required]],
      utilityTypeId: ['', [Validators.required]],
      tariffId: ['', [Validators.required]],
      meterNumber: ['', [Validators.required, Validators.minLength(5)]],
      connectionLoad: [0, [Validators.required, Validators.min(0)]],
      initialReading: [0, [Validators.required, Validators.min(0)]],
      activationDate: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadUtilityTypes();
    this.loadAllTariffs();

    // Filter tariffs when utility type changes
    this.connectionForm.get('utilityTypeId')?.valueChanges.subscribe(utilityTypeId => {
      this.filterTariffsByUtilityType(utilityTypeId);
      this.connectionForm.patchValue({ tariffId: '' });
    });
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

  loadAllTariffs(): void {
    this.tariffService.getAllTariffs().subscribe({
      next: (data) => {
        this.tariffs = data.filter(t => t.isActive);
      },
      error: (error) => {
        console.error('Failed to load tariffs', error);
      }
    });
  }

  filterTariffsByUtilityType(utilityTypeId: number): void {
    this.filteredTariffs = this.tariffs.filter(t => t.utilityTypeId === utilityTypeId);
  }

  onSubmit(): void {
    if (this.connectionForm.valid) {
      const formValue = this.connectionForm.value;
      
      const data = {
        consumerId: formValue.consumerId,
        utilityTypeId: formValue.utilityTypeId,
        tariffId: formValue.tariffId,
        meterNumber: formValue.meterNumber,
        connectionLoad: parseFloat(formValue.connectionLoad),
        initialReading: parseFloat(formValue.initialReading),
        activationDate: new Date(formValue.activationDate).toISOString()
      };
      
      this.dialogRef.close(data);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getConsumerDisplay(consumer: any): string {
    return `${consumer.firstName} ${consumer.lastName} (${consumer.email})`;
  }
}