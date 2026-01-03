export interface BillingCycle {
  billingCycleId: number;
  cycleName: string;
  startDate: string;
  endDate: string;
  meterReadingDeadline: string;
  billGenerationDate: string;
  dueDate: string;
  penaltyStartDate: string;
  isClosed: boolean;
  closedAt?: string;
  createdAt: string;
}

export interface CreateBillingCycleRequest {
  cycleName: string;
  startDate: string;
  endDate: string;
  meterReadingDeadline: string;
  billGenerationDate: string;
  dueDate: string;
  penaltyStartDate: string;
}