// src/app/components/bills/bill-list/bill-list.component.ts
import { Component, OnInit,signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillService } from '../../../core/services/bill';
import { Bill } from '../../../core/models/bill';
import { GenerateBillComponent } from '../generate-bill/generate-bill';

@Component({
  selector: 'app-bill-list',
  standalone: true,
  imports: [CommonModule, FormsModule, GenerateBillComponent],
  templateUrl: './bill-list.html',
  styleUrls: ['./bill-list.css']
})
export class BillListComponent implements OnInit {
  bills = signal<Bill[]>([]);
  filteredBills = signal<Bill[]>([]);
  loading = signal(false);
  error = signal('');
  searchTerm = signal('');
  showGenerateModal = signal(false);

  constructor(private billService: BillService) {}

  ngOnInit(): void {
    this.loadBills();
  }

  loadBills(): void {
    this.loading.set(true);
    this.error.set('');
    
    this.billService.getAllBills().subscribe({
      next: (data) => {
        this.bills.set(data);
        this.filteredBills.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load bills');
        this.loading.set(false);
        console.error('Error loading bills:', err);
      }
    });
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
    const searchLower = term.toLowerCase();
    
    if (!searchLower) {
      this.filteredBills.set(this.bills());
      return;
    }
    
    const filtered = this.bills().filter(bill => 
      bill.billNumber.toLowerCase().includes(searchLower) ||
      bill.consumerName.toLowerCase().includes(searchLower) ||
      bill.meterNumber.toLowerCase().includes(searchLower)
    );
    this.filteredBills.set(filtered);
  }

  formatCurrency(amount: number): string {
    return '₹' + amount.toFixed(2);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  openGenerateModal(): void {
    this.showGenerateModal.set(true);
  }

  closeGenerateModal(): void {
    this.showGenerateModal.set(false);
    this.loadBills();
  }
}