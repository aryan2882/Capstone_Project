export interface TariffSlab {
  tariffSlabId?: number;
  slabNumber: number;
  fromUnit: number;
  toUnit: number | null;
  ratePerUnit: number;
}

export interface Tariff {
  tariffId: number;
  planName: string;
  utilityTypeId: number;
  utilityTypeName?: string;
  fixedMonthlyCharge: number;
  minimumCharge: number;
  taxPercentage: number;
  isSlabBased: boolean;
  effectiveFrom: string;
  isActive: boolean;
  createdAt: string;
  tariffSlabs?: TariffSlab[];
}

export interface CreateTariffRequest {
  planName: string;
  utilityTypeId: number;
  fixedMonthlyCharge: number;
  minimumCharge: number;
  taxPercentage: number;
  isSlabBased: boolean;
  effectiveFrom: string;
  tariffSlabs: TariffSlab[];
}