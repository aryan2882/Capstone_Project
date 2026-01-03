export interface Connection {
  connectionId: number;
  consumerId: number;
  consumerName?: string;
  utilityTypeId: number;
  utilityTypeName?: string;
  tariffId: number;
  tariffName?: string;
  meterNumber: string;
  connectionLoad: number;
  initialReading: number;
  activationDate: string;
  disconnectionDate?: string;
  disconnectionReason?: string;
  status: string;
  createdAt: string;
}

export interface CreateConnectionRequest {
  consumerId: number;
  utilityTypeId: number;
  tariffId: number;
  meterNumber: string;
  connectionLoad: number;
  initialReading: number;
  activationDate: string;
}

export interface UpdateConnectionRequest {
  tariffId: number;
  meterNumber: string;
  connectionLoad: number;
}

export interface DisconnectConnectionRequest {
  reason: string;
}