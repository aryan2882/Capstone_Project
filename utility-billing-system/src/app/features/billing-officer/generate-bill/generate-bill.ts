// src/app/components/bills/generate-bill/generate-bill.component.ts
import { Component, OnInit, Output, EventEmitter,signal,computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BillService } from '../../../core/services/bill';
import { MeterReadingService } from '../../../core/services/meter-reading';
import { MeterReading } from '../../../core/models/meter-reading';

@Component({
  selector: 'app-generate-bill',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './generate-bill.html',
  styleUrls: ['./generate-bill.css']
})
export class GenerateBillComponent implements OnInit {
  @Output() billGenerated = new EventEmitter<void>();
  
  billingCycles = signal<any[]>([]);
  meterReadings = signal<MeterReading[]>([]);
  selectedBillingCycleId = signal<number | null>(null);
  selectedMeterReadingId = signal<number | null>(null);
  
  loading = signal(false);
  loadingCycles = signal(false);
  loadingReadings = signal(false);
  error = signal('');
  successMessage = signal('');

  selectedReading = computed(() => {
    const id = this.selectedMeterReadingId();
    return this.meterReadings().find(r => r.meterReadingId === id);
  });

  constructor(
    private billService: BillService,
    private meterReadingService: MeterReadingService
  ) {}

  ngOnInit(): void {
    this.loadBillingCycles();
  }

  loadBillingCycles(): void {
    this.loadingCycles.set(true);
    this.error.set('');

    this.meterReadingService.getBillingCycles().subscribe({
      next: (data) => {
        this.billingCycles.set(data);
        this.loadingCycles.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load billing cycles');
        this.loadingCycles.set(false);
        console.error('Error loading billing cycles:', err);
      }
    });
  }

  onBillingCycleChange(cycleId: number | null): void {
    this.selectedBillingCycleId.set(cycleId);
    
    if (!cycleId) {
      this.meterReadings.set([]);
      this.selectedMeterReadingId.set(null);
      return;
    }

    this.loadingReadings.set(true);
    this.error.set('');
    this.selectedMeterReadingId.set(null);

    this.meterReadingService.getByBillingCycle(cycleId).subscribe({
      next: (data) => {
        // Filter only readings that haven't been billed yet
        const unbilled = data.filter(r => !r.isBillGenerated);
        this.meterReadings.set(unbilled);
        this.loadingReadings.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load meter readings');
        this.loadingReadings.set(false);
        console.error('Error loading meter readings:', err);
      }
    });
  }

  onMeterReadingChange(readingId: number | null): void {
    this.selectedMeterReadingId.set(readingId);
  }

  generateBill(): void {
    const readingId = this.selectedMeterReadingId();
    
    if (!readingId) {
      this.error.set('Please select a meter reading');
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.successMessage.set('');

    this.billService.generateBill({ meterReadingId: readingId }).subscribe({
      next: (response) => {
        this.successMessage.set('Bill generated successfully!');
        this.loading.set(false);
        setTimeout(() => {
          this.billGenerated.emit();
        }, 1500);
      },
      error: (err) => {
        console.error('Full error:', err);
        
        let errorMsg = 'Failed to generate bill';
        if (err.error?.message) {
          errorMsg = err.error.message;
        } else if (err.error?.title) {
          errorMsg = err.error.title;
        } else if (typeof err.error === 'string') {
          errorMsg = err.error;
        } else if (err.status === 500) {
          errorMsg = 'Server error. The bill may have been created. Please check the bill list.';
        }
        
        this.error.set(errorMsg);
        this.loading.set(false);
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}