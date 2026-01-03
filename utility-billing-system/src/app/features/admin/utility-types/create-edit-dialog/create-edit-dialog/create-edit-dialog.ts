import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UtilityType } from '../../../../../core/models/utility-type';

@Component({
  selector: 'app-create-edit-utility-type-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule
  ],
  templateUrl: './create-edit-dialog.html',
  styleUrls: ['./create-edit-dialog.scss']
})
export class CreateEditUtilityTypeDialogComponent implements OnInit {
  utilityTypeForm: FormGroup;
  mode: 'create' | 'edit';
  utilityType?: UtilityType;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateEditUtilityTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit', utilityType?: UtilityType }
  ) {
    this.mode = data.mode;
    this.utilityType = data.utilityType;

    this.utilityTypeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      unitOfMeasurement: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      baseRate: ['', [Validators.required, Validators.min(0)]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    if (this.mode === 'edit' && this.utilityType) {
      this.utilityTypeForm.patchValue({
        name: this.utilityType.name,
        unitOfMeasurement: this.utilityType.unitOfMeasurement,
        description: this.utilityType.description,
        baseRate: this.utilityType.baseRate,
        isActive: this.utilityType.isActive
      });
    }
  }

  onSubmit(): void {
    if (this.utilityTypeForm.valid) {
      this.dialogRef.close(this.utilityTypeForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getTitle(): string {
    return this.mode === 'create' ? 'Create Utility Type' : 'Edit Utility Type';
  }
}