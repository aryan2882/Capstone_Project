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

export interface GenerateBillRequest {
  meterReadingId: number;
}