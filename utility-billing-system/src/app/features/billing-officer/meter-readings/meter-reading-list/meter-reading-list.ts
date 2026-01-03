import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatCard, MatCardTitle } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatFormField } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

import { MeterReadingService } from '../../../../core/services/meter-reading';
import { BillingCycleService } from '../../../admin/billing-cycles/billing-cycle';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-meter-reading-list',
  standalone: true,
  imports: [
    CommonModule,MatIcon,
    MatCard,
    MatCardTitle,
    MatDivider,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatButton,
    MatTableModule
  ],
  templateUrl: './meter-reading-list.html',
  styleUrls:['./meter-reading-list.css']
})
export class MeterReadingListComponent implements OnInit {
  billingCycles: any[] = [];
  selectedCycleId: number | null = null;

  readings: any[] = [];

  displayedColumns = ['consumer', 'meter', 'reading', 'consumption', 'date', 'remarks'];

  constructor(
    private billingCycleService: BillingCycleService,
    private meterReadingService: MeterReadingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBillingCycles();
  }

  loadBillingCycles(): void {
    this.billingCycleService.getAllBillingCycles().subscribe({
      next: (data) => {
        // Sort by start date ascending
        this.billingCycles = data.sort(
          (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
      }
    });
  }

  loadReadings(): void {
    if (!this.selectedCycleId) return;

    this.meterReadingService.getByBillingCycle(this.selectedCycleId).subscribe({
      next: (data) => (this.readings = data)
    });
  }

  navigateToAdd(): void {
    this.router.navigate(['/billing-officer/meter-readings/add']);
  }
}
