export interface MeterReading {
  meterReadingId: number;
  connectionId: number;
  meterNumber: string;
  consumerName: string;
  billingCycleId: number;
  cycleName: string;
  previousReading: number;
  currentReading: number;
  consumption: number;
  readingDate: string;  // ISO string
  remarks: string;
  isBillGenerated: boolean;
}
