// consumer.models.ts - Create in core/models/

export interface ConsumerProfile {
  consumerId: number;
  consumerCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  fatherName: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  idProofType: string;
  idProofNumber: string;
  createdAt: string;
}

export interface UpdateConsumerProfile {
  fatherName?: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  idProofType?: string;
  idProofNumber?: string;
}

export interface Bill {
  billId: number;
  billNumber: string;
  consumerId: number;
  consumerName: string;
  consumerCode: string;
  connectionId: number;
  meterNumber: string;
  utilityTypeName: string;
  cycleName: string;
  consumption: number;
  energyCharge: number;
  fixedCharge: number;
  previousOutstanding: number;
  subtotal: number;
  taxAmount: number;
  penaltyAmount: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  billDate: string;
  dueDate: string;
  paymentDate: string | null;
  status: 'Generated' | 'Partial' | 'Paid' | 'Overdue';
}

export interface Connection {
  connectionId: number;
  consumerId: number;
  consumerName: string;
  consumerCode: string;
  utilityTypeId: number;
  utilityTypeName: string;
  tariffId: number;
  tariffName: string;
  meterNumber: string;
  connectionLoad: number;
  initialReading: number;
  activationDate: string;
  status: 'Active' | 'Disconnected' | 'Suspended';
  disconnectionDate: string | null;
  disconnectionReason: string | null;
}

export interface MonthlyConsumption {
  month: string;
  readingDate: string;
  previousReading: number;
  currentReading: number;
  consumption: number;
  billAmount: number;
  billStatus: string;
}

export interface ConsumptionSummary {
  totalConsumption: number;
  averageMonthlyConsumption: number;
  highestConsumption: number;
  lowestConsumption: number;
  totalMonths: number;
  currentMonthConsumption: number;
  comparisonWithLastMonth: string;
}

export interface ConsumptionReport {
  connectionId: number;
  meterNumber: string;
  utilityTypeName: string;
  monthlyConsumption: MonthlyConsumption[];
  summary: ConsumptionSummary;
}