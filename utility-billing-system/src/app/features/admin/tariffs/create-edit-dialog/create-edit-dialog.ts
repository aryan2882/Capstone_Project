import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { Tariff, TariffSlab } from '../../../../core/models/tariff';
import { UtilityType } from '../../../../core/models/utility-type';

@Component({
  selector: 'app-create-edit-tariff-dialog',
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
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule
  ],
  templateUrl: './create-edit-dialog.html',
  styleUrls: ['./create-edit-dialog.scss']
})
export class CreateEditTariffDialogComponent implements OnInit {
  tariffForm: FormGroup;
  mode: 'create' | 'edit';
  tariff?: Tariff;
  utilityTypes: UtilityType[];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateEditTariffDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      mode: 'create' | 'edit', 
      tariff?: Tariff,
      utilityTypes: UtilityType[]
    }
  ) {
    this.mode = data.mode;
    this.tariff = data.tariff;
    this.utilityTypes = data.utilityTypes;

    this.tariffForm = this.fb.group({
      planName: ['', [Validators.required, Validators.minLength(3)]],
      utilityTypeId: ['', [Validators.required]],
      fixedMonthlyCharge: [0, [Validators.required, Validators.min(0)]],
      minimumCharge: [0, [Validators.required, Validators.min(0)]],
      taxPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      isSlabBased: [true],
      effectiveFrom: ['', [Validators.required]],
      tariffSlabs: this.fb.array([])
    });
  }

  ngOnInit(): void {
    if (this.mode === 'edit' && this.tariff) {
      this.tariffForm.patchValue({
        planName: this.tariff.planName,
        utilityTypeId: this.tariff.utilityTypeId,
        fixedMonthlyCharge: this.tariff.fixedMonthlyCharge,
        minimumCharge: this.tariff.minimumCharge,
        taxPercentage: this.tariff.taxPercentage,
        isSlabBased: this.tariff.isSlabBased,
        effectiveFrom: new Date(this.tariff.effectiveFrom)
      });

      if (this.tariff.tariffSlabs && this.tariff.tariffSlabs.length > 0) {
        this.tariff.tariffSlabs.forEach(slab => {
          this.addSlab(slab);
        });
      } else {
        this.addSlab();
      }
    } else {
      // Add default slabs for create mode
      this.addSlab();
    }
  }

  get tariffSlabs(): FormArray {
    return this.tariffForm.get('tariffSlabs') as FormArray;
  }

  addSlab(slab?: TariffSlab): void {
    const slabForm = this.fb.group({
      slabNumber: [slab?.slabNumber || this.tariffSlabs.length + 1, [Validators.required]],
      fromUnit: [slab?.fromUnit || 0, [Validators.required, Validators.min(0)]],
      toUnit: [slab?.toUnit, [Validators.min(0)]],
      ratePerUnit: [slab?.ratePerUnit || 0, [Validators.required, Validators.min(0)]]
    });

    this.tariffSlabs.push(slabForm);
  }

  removeSlab(index: number): void {
    if (this.tariffSlabs.length > 1) {
      this.tariffSlabs.removeAt(index);
      this.reorderSlabs();
    }
  }

  reorderSlabs(): void {
    this.tariffSlabs.controls.forEach((control, index) => {
      control.get('slabNumber')?.setValue(index + 1);
    });
  }

  onSubmit(): void {
    if (this.tariffForm.valid) {
      const formValue = this.tariffForm.value;
      
      const data = {
        planName: formValue.planName,
        utilityTypeId: formValue.utilityTypeId,
        fixedMonthlyCharge: parseFloat(formValue.fixedMonthlyCharge),
        minimumCharge: parseFloat(formValue.minimumCharge),
        taxPercentage: parseFloat(formValue.taxPercentage),
        isSlabBased: formValue.isSlabBased,
        effectiveFrom: new Date(formValue.effectiveFrom).toISOString(),
        tariffSlabs: formValue.tariffSlabs.map((slab: any) => ({
          slabNumber: slab.slabNumber,
          fromUnit: parseFloat(slab.fromUnit),
          toUnit: slab.toUnit ? parseFloat(slab.toUnit) : null,
          ratePerUnit: parseFloat(slab.ratePerUnit)
        }))
      };
      
      this.dialogRef.close(data);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getTitle(): string {
    return this.mode === 'create' ? 'Create Tariff Plan' : 'Edit Tariff Plan';
  }
}