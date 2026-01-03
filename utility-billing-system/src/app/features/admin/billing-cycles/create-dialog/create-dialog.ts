import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-create-billing-cycle-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule
  ],
  templateUrl: './create-dialog.html',
  styleUrls: ['./create-dialog.scss']
})
export class CreateBillingCycleDialogComponent {
  billingCycleForm: FormGroup;
  minDate = new Date();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateBillingCycleDialogComponent>
  ) {
    this.billingCycleForm = this.fb.group({
      cycleName: ['', [Validators.required, Validators.minLength(3)]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      meterReadingDeadline: ['', [Validators.required]],
      billGenerationDate: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
      penaltyStartDate: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.billingCycleForm.valid) {
      const formValue = this.billingCycleForm.value;
      
      // Convert dates to ISO string format
      const data = {
        cycleName: formValue.cycleName,
        startDate: new Date(formValue.startDate).toISOString(),
        endDate: new Date(formValue.endDate).toISOString(),
        meterReadingDeadline: new Date(formValue.meterReadingDeadline).toISOString(),
        billGenerationDate: new Date(formValue.billGenerationDate).toISOString(),
        dueDate: new Date(formValue.dueDate).toISOString(),
        penaltyStartDate: new Date(formValue.penaltyStartDate).toISOString()
      };
      
      this.dialogRef.close(data);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  autoFillDates(): void {
    const startDate = this.billingCycleForm.get('startDate')?.value;
    if (startDate) {
      const start = new Date(startDate);
      const endDate = new Date(start);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0); // Last day of month
      
      const meterDeadline = new Date(endDate);
      meterDeadline.setDate(meterDeadline.getDate() + 5);
      
      const billGenDate = new Date(meterDeadline);
      billGenDate.setDate(billGenDate.getDate() + 2);
      
      const dueDate = new Date(billGenDate);
      dueDate.setDate(dueDate.getDate() + 13);
      
      const penaltyDate = new Date(dueDate);
      penaltyDate.setDate(penaltyDate.getDate() + 1);
      
      this.billingCycleForm.patchValue({
        endDate: endDate,
        meterReadingDeadline: meterDeadline,
        billGenerationDate: billGenDate,
        dueDate: dueDate,
        penaltyStartDate: penaltyDate
      });
    }
  }
}