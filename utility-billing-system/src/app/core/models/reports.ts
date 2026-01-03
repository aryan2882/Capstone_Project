// reports.models.ts - Create in core/models/

export interface RevenueReport {
  period: string;
  totalBillAmount: number;
  totalCollected: number;
  totalOutstanding: number;
  totalBills: number;
  paidBills: number;
  unpaidBills: number;
}

export interface OutstandingConsumer {
  consumerId: number;
  consumerCode: string;
  consumerName: string;
  phone: string;
  totalOutstanding: number;
  unpaidBillsCount: number;
  oldestBillDate: string;
  daysOverdue: number;
}

export interface ConsumptionReportData {
  utilityType: string;
  totalConsumption: number;
  averageConsumption: number;
  totalConnections: number;
  highestConsumption: number;
  lowestConsumption: number;
}

export interface CollectionData {
  date: string;
  paymentMode: string;
  totalAmount: number;
  transactionCount: number;
}

export interface ConsumerSummary {
  consumerId: number;
  consumerCode: string;
  consumerName: string;
  utilityType: string;
  totalBilled: number;
  totalPaid: number;
  totalOutstanding: number;
  averageMonthlyConsumption: number;
  totalBills: number;
}

export interface BillingCycle {
  billingCycleId: number;
  cycleName: string;
  startDate: string;
  endDate: string;
  status: string;
}