// account-officer.models.ts - Create in core/models/

import { Bill} from './consumer_new';
import { Payment } from './payment';

export interface Consumer {
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

export interface RecordOfflinePaymentRequest {
  billId: number;
  amount: number;
  paymentMode: number; // 1=Cash, 3=Cheque, 4=BankTransfer, 5=DD
  paymentDate: string;
  remarks: string;
}

export interface OfflinePaymentResponse {
  success: boolean;
  message: string;
  receiptNumber: string;
  payment: Payment;
}

export enum OfflinePaymentMode {
  Cash = 1,
  Cheque = 3,
  BankTransfer = 4,
  DemandDraft = 5
}

// Re-export for convenience
export type { Bill, Payment };