// payment.models.ts - Add to core/models/

export interface MakePaymentRequest {
  billId: number;
  amount: number;
  paymentMode: number; // 1=Cash, 2=Online, 3=Cheque
  paymentMethod: string; // "UPI", "Card", "NetBanking", etc.
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId: string;
  receiptNumber: string;
  payment: Payment;
}

export interface Payment {
  paymentId: number;
  receiptNumber: string;
  consumerId: number;
  consumerName: string;
  billId: number;
  billNumber: string;
  amount: number;
  paymentMode: string; // "Online", "Cash", "Cheque"
  transactionId: string | null;
  paymentDate: string;
  remarks: string;
}

export enum PaymentMode {
  Cash = 1,
  Online = 2,
  Cheque = 3
}

export enum PaymentMethod {
  UPI = 'UPI',
  Card = 'Card',
  NetBanking = 'NetBanking',
  Cash = 'Cash',
  Cheque = 'Cheque'
}