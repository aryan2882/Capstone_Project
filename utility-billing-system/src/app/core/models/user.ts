export interface User {
  userId: number;  // Changed from 'id' to 'userId' to match API
  firstName: string;
  lastName: string;
  fatherName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  idProofType: string;
  idProofNumber: string;
  role?: number;  // Made optional since pending users don't have role
  roleName?: string;
  isActive?: boolean;  // Made optional
  createdAt: string;
}

export enum UserRole {
  Admin = 1,
  BillingOfficer = 2,
  AccountOfficer = 3,
  Consumer = 4
}

// Role name mapping for display
export const RoleNames: { [key: number]: string } = {
  1: 'Admin',
  2: 'BillingOfficer',
  3: 'AccountOfficer',
  4: 'Consumer'
};

// Role string to number mapping (for API responses that return role as string)
export const RoleStringToNumber: { [key: string]: number } = {
  'Admin': 1,
  'BillingOfficer': 2,
  'AccountOfficer': 3,
  'Consumer': 4
};