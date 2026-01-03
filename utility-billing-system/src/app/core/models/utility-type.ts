export interface UtilityType {
  utilityTypeId: number;
  name: string;
  unitOfMeasurement: string;
  description: string;
  baseRate: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUtilityTypeRequest {
  name: string;
  unitOfMeasurement: string;
  description: string;
  baseRate: number;
}

export interface UpdateUtilityTypeRequest {
  name: string;
  unitOfMeasurement: string;
  description: string;
  baseRate: number;
  isActive: boolean;
}