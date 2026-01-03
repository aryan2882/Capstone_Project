// consumers.component.ts

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AccountOfficerService } from '../../../core/services/account-officer';

@Component({
  selector: 'app-consumers',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatTooltipModule
  ],
  template: `
    <div class="consumers-container">
      <div class="page-header">
        <div>
          <h1><mat-icon>people</mat-icon> Consumers</h1>
          <p>View and manage all registered consumers</p>
        </div>
      </div>

      <div *ngIf="loading()" class="loading">
        <mat-spinner></mat-spinner>
      </div>

      <div *ngIf="!loading()">
        <!-- Search -->
        <mat-card class="search-card">
          <mat-form-field appearance="outline">
            <mat-label>Search Consumers</mat-label>
            <input matInput placeholder="Name, code, email, phone..." [(ngModel)]="searchTerm" (ngModelChange)="applySearch()">
            <mat-icon matPrefix>search</mat-icon>
            <button mat-icon-button matSuffix *ngIf="searchTerm" (click)="clearSearch()">
              <mat-icon>clear</mat-icon>
            </button>
          </mat-form-field>
        </mat-card>

        <!-- Consumers Table -->
        <mat-card>
          <div *ngIf="filteredConsumers.length === 0" class="empty-state">
            <mat-icon>person_off</mat-icon>
            <h2>No Consumers Found</h2>
            <p>No consumers match your search criteria.</p>
          </div>

          <div *ngIf="filteredConsumers.length > 0" class="table-container">
            <table class="consumers-table">
              <thead>
                <tr>
                  <th>Consumer Code</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Address</th>
                  <th>ID Proof</th>
                  <th>Registered On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let consumer of filteredConsumers">
                  <td class="consumer-code">{{consumer.consumerCode}}</td>
                  <td>
                    <div class="consumer-name">
                      <strong>{{consumer.firstName}} {{consumer.lastName}}</strong>
                      <span class="father-name" *ngIf="consumer.fatherName">
                        S/O {{consumer.fatherName}}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div class="contact-info">
                      <div class="contact-row">
                        <mat-icon>email</mat-icon>
                        <span>{{consumer.email}}</span>
                      </div>
                      <div class="contact-row">
                        <mat-icon>phone</mat-icon>
                        <span>{{consumer.phone}}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="address" *ngIf="consumer.address">
                      {{consumer.address}}<br>
                      {{consumer.city}}, {{consumer.state}} - {{consumer.pinCode}}
                    </div>
                    <span *ngIf="!consumer.address" class="no-data">Not provided</span>
                  </td>
                  <td>
                    <div *ngIf="consumer.idProofType" class="id-proof">
                      <strong>{{consumer.idProofType}}</strong><br>
                      <span class="id-number">{{consumer.idProofNumber}}</span>
                    </div>
                    <span *ngIf="!consumer.idProofType" class="no-data">Not provided</span>
                  </td>
                  <td>{{consumer.createdAt | date:'dd MMM yyyy'}}</td>
                  <td class="actions">
                    <button mat-icon-button 
                            [routerLink]="['/account-officer/bills']" 
                            [queryParams]="{consumerId: consumer.consumerId}"
                            matTooltip="View Bills">
                      <mat-icon>receipt</mat-icon>
                    </button>
                    <button mat-icon-button 
                            [routerLink]="['/account-officer/payments']" 
                            [queryParams]="{consumerId: consumer.consumerId}"
                            matTooltip="View Payments">
                      <mat-icon>payments</mat-icon>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="table-footer" *ngIf="filteredConsumers.length > 0">
            <p>Showing {{filteredConsumers.length}} of {{consumers.length}} consumers</p>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .consumers-container { max-width: 1400px; margin: 0 auto; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { display: flex; align-items: center; gap: 12px; font-size: 28px; margin: 0 0 4px 0; }
    .page-header p { color: #666; margin: 0; }
    
    .loading { display: flex; justify-content: center; padding: 60px; }
    
    .search-card { padding: 24px; margin-bottom: 24px; }
    .search-card mat-form-field { width: 100%; }
    
    .empty-state { text-align: center; padding: 80px 20px; }
    .empty-state mat-icon { font-size: 100px; width: 100px; height: 100px; color: #999; opacity: 0.5; }
    .empty-state h2 { margin: 24px 0 8px 0; }
    .empty-state p { color: #666; }
    
    .table-container { overflow-x: auto; }
    .consumers-table { width: 100%; border-collapse: collapse; }
    .consumers-table th { background-color: #f8f9fa; padding: 16px; text-align: left; font-weight: 600; border-bottom: 2px solid #e0e0e0; white-space: nowrap; }
    .consumers-table td { padding: 16px; border-bottom: 1px solid #f0f0f0; vertical-align: top; }
    .consumers-table tr:hover { background-color: #f8f9fa; }
    
    .consumer-code { font-weight: 600; color: #667eea; font-family: monospace; }
    .consumer-name { display: flex; flex-direction: column; }
    .father-name { font-size: 13px; color: #999; margin-top: 4px; }
    
    .contact-info { display: flex; flex-direction: column; gap: 8px; }
    .contact-row { display: flex; align-items: center; gap: 8px; font-size: 14px; }
    .contact-row mat-icon { font-size: 16px; width: 16px; height: 16px; color: #667eea; }
    
    .address { font-size: 14px; line-height: 1.6; max-width: 250px; }
    .no-data { color: #999; font-style: italic; font-size: 14px; }
    
    .id-proof { font-size: 14px; }
    .id-number { color: #666; font-family: monospace; }
    
    .actions { white-space: nowrap; }
    
    .table-footer { padding: 16px 24px; border-top: 1px solid #e0e0e0; background-color: #f8f9fa; text-align: center; }
    .table-footer p { margin: 0; color: #666; font-size: 14px; }
    
    @media (max-width: 768px) {
      .table-container { font-size: 13px; }
      .consumers-table th, .consumers-table td { padding: 12px 8px; }
    }
  `]
})
export class ConsumersComponent implements OnInit {
  loading = signal(true);
  searchTerm = '';

  constructor(private aoService: AccountOfficerService) {}

  get consumers() {
    return this.aoService.consumers();
  }

  get filteredConsumers() {
    if (!this.searchTerm) return this.consumers;

    const term = this.searchTerm.toLowerCase();
    return this.consumers.filter(c =>
      c.firstName.toLowerCase().includes(term) ||
      c.lastName.toLowerCase().includes(term) ||
      c.consumerCode.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.phone.includes(term)
    );
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.aoService.getAllConsumers().subscribe({
      next: () => this.loading.set(false),
      error: (err) => {
        console.error('Error loading consumers:', err);
        this.loading.set(false);
      }
    });
  }

  applySearch(): void {
    // Triggers filtering through getter
  }

  clearSearch(): void {
    this.searchTerm = '';
  }
}