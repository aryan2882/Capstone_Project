// consumption-report.component.ts - Updated with Signals

import { Component, OnInit, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { ConsumerService } from '../../../core/services/consumer';
import { ConsumptionReport } from '../../../core/models/consumer_new';

@Component({
  selector: 'app-consumption-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    NgChartsModule
  ],
  template: `
    <div class="consumption-container">
      <div class="page-header">
        <h1><mat-icon>bar_chart</mat-icon> Consumption Report</h1>
        <p>Track your utility consumption patterns and trends</p>
      </div>

      <div *ngIf="loading()" class="loading">
        <mat-spinner></mat-spinner>
      </div>

      <div *ngIf="!loading()">
        <!-- Connection Selector -->
        <mat-card class="selector-card">
          <mat-form-field appearance="outline">
            <mat-label>Select Connection</mat-label>
            <mat-select [(ngModel)]="selectedConnectionId" (selectionChange)="onConnectionChange()">
              <mat-option *ngFor="let conn of connections" [value]="conn.connectionId">
                <mat-icon>{{getUtilityIcon(conn.utilityTypeName)}}</mat-icon>
                {{conn.utilityTypeName}} - {{conn.meterNumber}}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </mat-card>

        <div *ngIf="selectedConnectionId && consumptionData()">
          <!-- Summary Cards -->
          <div class="summary-grid">
            <mat-card class="stat-card">
              <div class="stat-icon total">
                <mat-icon>show_chart</mat-icon>
              </div>
              <div class="stat-content">
                <h3>{{consumptionData()!.summary.totalConsumption | number:'1.2-2'}}</h3>
                <p>Total Consumption (units)</p>
              </div>
            </mat-card>

            <mat-card class="stat-card">
              <div class="stat-icon average">
                <mat-icon>trending_up</mat-icon>
              </div>
              <div class="stat-content">
                <h3>{{consumptionData()!.summary.averageMonthlyConsumption | number:'1.2-2'}}</h3>
                <p>Average Monthly (units)</p>
              </div>
            </mat-card>

            <mat-card class="stat-card">
              <div class="stat-icon highest">
                <mat-icon>arrow_upward</mat-icon>
              </div>
              <div class="stat-content">
                <h3>{{consumptionData()!.summary.highestConsumption | number:'1.2-2'}}</h3>
                <p>Highest Consumption</p>
              </div>
            </mat-card>

            <mat-card class="stat-card">
              <div class="stat-icon lowest">
                <mat-icon>arrow_downward</mat-icon>
              </div>
              <div class="stat-content">
                <h3>{{consumptionData()!.summary.lowestConsumption | number:'1.2-2'}}</h3>
                <p>Lowest Consumption</p>
              </div>
            </mat-card>
          </div>

          <!-- Comparison Card -->
          <mat-card class="comparison-card">
            <mat-icon>compare_arrows</mat-icon>
            <div>
              <h3>Month-over-Month Comparison</h3>
              <p>{{consumptionData()!.summary.comparisonWithLastMonth}}</p>
            </div>
          </mat-card>

          <!-- Chart -->
          <mat-card class="chart-card" *ngIf="chartDataReady()">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>insert_chart</mat-icon>
                Consumption Trend
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <canvas baseChart
                [data]="lineChartData()"
                [options]="lineChartOptions"
                [type]="'line'">
              </canvas>
            </mat-card-content>
          </mat-card>

          <!-- Monthly Details Table -->
          <mat-card class="details-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>table_chart</mat-icon>
                Monthly Consumption Details
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="table-container">
                <table class="consumption-table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Reading Date</th>
                      <th>Previous Reading</th>
                      <th>Current Reading</th>
                      <th>Consumption</th>
                      <th>Bill Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of consumptionData()!.monthlyConsumption">
                      <td class="month-cell">{{item.month}}</td>
                      <td>{{item.readingDate | date:'dd MMM yyyy'}}</td>
                      <td>{{item.previousReading | number:'1.2-2'}}</td>
                      <td>{{item.currentReading | number:'1.2-2'}}</td>
                      <td class="consumption-cell">
                        <span class="consumption-badge">
                          {{item.consumption | number:'1.2-2'}} units
                        </span>
                      </td>
                      <td class="amount-cell">₹{{item.billAmount | number:'1.2-2'}}</td>
                      <td>
                        <span class="status-badge" [class]="'status-' + item.billStatus.toLowerCase()">
                          {{item.billStatus}}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Loading Report State -->
        <div *ngIf="selectedConnectionId && loadingReport()" class="loading">
          <mat-spinner></mat-spinner>
          <p>Loading consumption report...</p>
        </div>

        <div *ngIf="!selectedConnectionId" class="empty-state">
          <mat-icon>bar_chart</mat-icon>
          <h2>Select a Connection</h2>
          <p>Please select a connection to view consumption report</p>
        </div>

        <div *ngIf="selectedConnectionId && !consumptionData() && !loadingReport()" class="empty-state">
          <mat-icon>inbox</mat-icon>
          <h2>No Data Available</h2>
          <p>No consumption data found for this connection</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .consumption-container { max-width: 1400px; margin: 0 auto; }
    .page-header { margin-bottom: 32px; }
    .page-header h1 { display: flex; align-items: center; gap: 12px; font-size: 28px; margin: 0 0 8px 0; }
    .page-header p { color: #666; margin: 0; }
    .loading { display: flex; justify-content: center; padding: 60px; }
    .selector-card { padding: 24px; margin-bottom: 24px; }
    .selector-card mat-form-field { width: 100%; max-width: 400px; }
    .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 24px; }
    .stat-card { display: flex; align-items: center; padding: 24px; transition: transform 0.3s ease; }
    .stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12); }
    .stat-icon { width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 16px; }
    .stat-icon mat-icon { font-size: 32px; width: 32px; height: 32px; color: white; }
    .stat-icon.total { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .stat-icon.average { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .stat-icon.highest { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    .stat-icon.lowest { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
    .stat-content h3 { margin: 0; font-size: 28px; font-weight: 600; }
    .stat-content p { margin: 4px 0 0 0; color: #666; font-size: 14px; }
    .comparison-card { display: flex; align-items: center; gap: 16px; padding: 24px; margin-bottom: 24px; background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); }
    .comparison-card mat-icon { font-size: 48px; width: 48px; height: 48px; color: #d84315; }
    .comparison-card h3 { margin: 0 0 8px 0; font-size: 18px; font-weight: 600; }
    .comparison-card p { margin: 0; font-size: 16px; color: #5d4037; }
    .chart-card, .details-card { margin-bottom: 24px; }
    .chart-card mat-card-header, .details-card mat-card-header { padding: 20px 24px; border-bottom: 1px solid #e0e0e0; }
    mat-card-title { display: flex; align-items: center; gap: 12px; font-size: 20px; font-weight: 600; margin: 0; }
    mat-card-title mat-icon { color: #667eea; }
    mat-card-content { padding: 24px; }
    .table-container { overflow-x: auto; }
    .consumption-table { width: 100%; border-collapse: collapse; }
    .consumption-table th { background-color: #f8f9fa; padding: 16px; text-align: left; font-weight: 600; color: #333; border-bottom: 2px solid #e0e0e0; white-space: nowrap; }
    .consumption-table td { padding: 16px; border-bottom: 1px solid #f0f0f0; }
    .consumption-table tr:hover { background-color: #f8f9fa; }
    .month-cell { font-weight: 600; color: #667eea; }
    .consumption-badge { background-color: #e3f2fd; color: #1976d2; padding: 6px 12px; border-radius: 16px; font-size: 13px; font-weight: 500; }
    .amount-cell { font-weight: 600; color: #2e7d32; font-size: 15px; }
    .status-badge { padding: 6px 12px; border-radius: 16px; font-size: 12px; font-weight: 500; }
    .status-badge.status-paid { background-color: #4caf50; color: white; }
    .status-badge.status-pending { background-color: #ff9800; color: white; }
    .status-badge.status-overdue { background-color: #f44336; color: white; }
    .empty-state { text-align: center; padding: 80px 20px; color: #999; }
    .empty-state mat-icon { font-size: 100px; width: 100px; height: 100px; opacity: 0.3; }
    .empty-state h2 { margin: 24px 0 8px 0; font-size: 24px; }
    .empty-state p { font-size: 16px; }
    @media (max-width: 768px) {
      .summary-grid { grid-template-columns: 1fr; }
      .comparison-card { flex-direction: column; text-align: center; }
      .consumption-table { font-size: 13px; }
      .consumption-table th, .consumption-table td { padding: 12px 8px; }
    }
  `]
})
export class ConsumptionReportComponent implements OnInit {
  loading = signal(true);
  loadingReport = signal(false);
  selectedConnectionId?: number;
  private initialized = false;
  
  constructor(
    private consumerService: ConsumerService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}
  
  // Use getters to access service signals
  get connections() {
    return this.consumerService.activeConnections();
  }
  
  // Local signal for consumption data
  consumptionData = signal<ConsumptionReport | null>(null);
  
  // Chart data signal
  lineChartData = signal<ChartConfiguration['data']>({
    datasets: [],
    labels: []
  });
  
  // Signal to track if chart data is ready
  chartDataReady = computed(() => 
    this.lineChartData().datasets.length > 0
  );

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Consumption (units)' }
      },
      x: {
        title: { display: true, text: 'Month' }
      }
    }
  };

  ngOnInit(): void {
    this.loadConnections();
    
    // Check if connectionId is passed in query params
    this.route.queryParams.subscribe(params => {
      if (params['connectionId']) {
        this.selectedConnectionId = +params['connectionId'];
      }
    });
  }

  loadConnections(): void {
    const profile = this.consumerService.profile();
    
    if (profile) {
      // Profile already loaded
      const connections = this.connections;
      if (connections.length > 0) {
        this.loading.set(false);
        // Auto-select if connectionId was in query params
        if (this.selectedConnectionId) {
          setTimeout(() => this.loadConsumptionReport(), 150);
        }
      } else {
        // Need to load connections
        this.consumerService.getMyConnections(profile.consumerId).subscribe({
          next: () => {
            this.loading.set(false);
            // Auto-load report if connection was selected
            if (this.selectedConnectionId) {
              setTimeout(() => this.loadConsumptionReport(), 150);
            }
          },
          error: (err) => {
            console.error('Error loading connections:', err);
            this.loading.set(false);
          }
        });
      }
    } else {
      // Load everything
      this.consumerService.loadAllConsumerData().subscribe({
        next: () => {
          this.loading.set(false);
          // Auto-load report if connection was selected
          if (this.selectedConnectionId) {
            setTimeout(() => this.loadConsumptionReport(), 150);
          }
        },
        error: (err) => {
          console.error('Error loading data:', err);
          this.loading.set(false);
        }
      });
    }
  }

  onConnectionChange(): void {
    if (this.selectedConnectionId) {
      this.loadConsumptionReport();
    }
  }

  loadConsumptionReport(): void {
    if (!this.selectedConnectionId) return;

    this.loadingReport.set(true);
    this.cdr.detectChanges(); // Force view update
    
    this.consumerService.getConsumptionReport(this.selectedConnectionId).subscribe({
      next: (data) => {
        this.consumptionData.set(data);
        this.prepareChartData(data);
        this.loadingReport.set(false);
        this.cdr.detectChanges(); // Force view update after data loads
      },
      error: (err) => {
        console.error('Error loading consumption report:', err);
        this.consumptionData.set(null);
        this.loadingReport.set(false);
        this.cdr.detectChanges(); // Force view update on error
      }
    });
  }

  prepareChartData(data: ConsumptionReport): void {
    const months = data.monthlyConsumption.map(m => m.month);
    const consumption = data.monthlyConsumption.map(m => m.consumption);
    const billAmounts = data.monthlyConsumption.map(m => m.billAmount);

    this.lineChartData.set({
      labels: months,
      datasets: [
        {
          data: consumption,
          label: 'Consumption (units)',
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          data: billAmounts,
          label: 'Bill Amount (₹)',
          borderColor: '#f5576c',
          backgroundColor: 'rgba(245, 87, 108, 0.1)',
          tension: 0.4,
          fill: true,
          yAxisID: 'y1'
        }
      ]
    });

    // Add second y-axis for bill amount
    if (this.lineChartOptions && this.lineChartOptions.scales) {
      this.lineChartOptions.scales['y1'] = {
        position: 'right',
        title: { display: true, text: 'Bill Amount (₹)' },
        grid: { drawOnChartArea: false }
      };
    }
  }

  getUtilityIcon(utilityType: string): string {
    const icons: { [key: string]: string } = {
      'Electricity': 'bolt',
      'Water': 'water_drop',
      'Gas': 'local_fire_department'
    };
    return icons[utilityType] || 'power';
  }
}