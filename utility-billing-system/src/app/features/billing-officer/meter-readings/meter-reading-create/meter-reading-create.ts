import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MeterReadingService } from '../../../../core/services/meter-reading';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-meter-reading-create',
  templateUrl: './meter-reading-create.html',
  styleUrls:['./meter-reading-create.css'],
  imports: [
    CommonModule,MatIcon,
    ReactiveFormsModule,
    FormsModule,

    // Angular Material
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatDividerModule,

    RouterModule
  ]
})
export class MeterReadingCreateComponent implements OnInit {

  form!: FormGroup;
  connections: any[] = [];
  billingCycles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: MeterReadingService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      connectionId: ['', Validators.required],
      billingCycleId: ['', Validators.required],
      currentReading: ['', [Validators.required, Validators.min(0)]],
      readingDate: ['', Validators.required],
      remarks: ['']
    });

    this.loadData();
  }

  loadData() {
    this.service.getConnections().subscribe(res => this.connections = res);
    this.service.getBillingCycles().subscribe(res => {
      this.billingCycles = res.filter(c => !c.isClosed);
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.service.createReading(this.form.value).subscribe({
      next: (response) => {
        this.snack.open(`Reading added for ${response.consumerName}`, 'Close', { duration: 3000 });
        this.form.reset();
      },
      error: () => this.snack.open('Failed to add reading', 'Close', { duration: 3000 })
    });
  }
}
